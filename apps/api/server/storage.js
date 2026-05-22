import crypto from "node:crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "./config.js";
import { AccessDeniedError, FileStorageError, InvalidFileError } from "./errors.js";

const allowedCategories = new Set([
  "banners",
  "speakers",
  "certificates",
  "abstracts",
  "sponsors",
  "profiles",
  "brochures"
]);

const allowedExtensions = new Set(["jpg", "jpeg", "png", "pdf", "ppt", "pptx"]);
const allowedContentTypes = {
  jpg: new Set(["image/jpeg"]),
  jpeg: new Set(["image/jpeg"]),
  png: new Set(["image/png"]),
  pdf: new Set(["application/pdf"]),
  ppt: new Set(["application/vnd.ms-powerpoint"]),
  pptx: new Set(["application/vnd.openxmlformats-officedocument.presentationml.presentation"])
};

const s3Client = new S3Client({
  region: config.awsRegion,
  ...(config.awsAccessKey && config.awsSecretKey
    ? {
        credentials: {
          accessKeyId: config.awsAccessKey,
          secretAccessKey: config.awsSecretKey
        }
      }
    : {})
});

function validateS3Configuration() {
  if (!config.awsBucketName.trim()) {
    throw new FileStorageError("AWS_BUCKET_NAME is not configured");
  }

  if (!config.awsRegion.trim()) {
    throw new FileStorageError("AWS_REGION is not configured");
  }
}

export function validateCategory(category) {
  const normalizedCategory = String(category ?? "").trim().toLowerCase();

  if (!allowedCategories.has(normalizedCategory)) {
    throw new InvalidFileError("Invalid upload category");
  }

  return normalizedCategory;
}

export function validateObjectKey(objectKey) {
  const normalizedKey = String(objectKey ?? "").trim();

  if (!normalizedKey) {
    throw new InvalidFileError("Required value is missing");
  }

  if (normalizedKey.includes("..") || normalizedKey.includes("\\") || normalizedKey.startsWith("/")) {
    throw new InvalidFileError("Unsafe object key detected");
  }

  const [category, fileName] = normalizedKey.split("/", 2);
  if (!allowedCategories.has(String(category).toLowerCase()) || !fileName?.trim()) {
    throw new InvalidFileError("Object key must start with a valid category folder");
  }

  return normalizedKey;
}

function extractExtension(fileName) {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex < 0 || lastDotIndex === fileName.length - 1) {
    throw new InvalidFileError("File extension is required");
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

function validateFileBasics(file, emptyMessage) {
  if (!file || !file.buffer?.length) {
    throw new InvalidFileError(emptyMessage);
  }

  const originalFileName = String(file.originalname ?? "").trim();
  if (!originalFileName) {
    throw new InvalidFileError("Original file name is missing");
  }

  if (originalFileName.includes("..") || originalFileName.includes("/") || originalFileName.includes("\\")) {
    throw new InvalidFileError("Unsafe file name detected");
  }

  return originalFileName;
}

function validateManagedFile(file, category) {
  const normalizedCategory = validateCategory(category);
  const originalFileName = validateFileBasics(file, "Please provide a non-empty file");
  const extension = extractExtension(originalFileName);
  if (!allowedExtensions.has(extension)) {
    throw new InvalidFileError("Invalid file type. Allowed types: jpg, jpeg, png, pdf, ppt, pptx");
  }

  const contentType = String(file.mimetype ?? "").trim().toLowerCase();
  if (!allowedContentTypes[extension]?.has(contentType)) {
    throw new InvalidFileError("Invalid content type for the uploaded file");
  }

  return { normalizedCategory, extension, contentType, originalFileName };
}

function validateAbstractStorageFile(file) {
  const originalFileName = validateFileBasics(file, "Please upload a DOC, DOCX, or PDF file.");
  const extension = extractExtension(originalFileName);

  if (!["pdf", "doc", "docx"].includes(extension)) {
    throw new InvalidFileError("Accepted file formats are DOC, DOCX, or PDF.");
  }

  const contentType = String(file.mimetype ?? "").trim().toLowerCase();
  const allowedContentTypes = {
    pdf: new Set(["application/pdf"]),
    doc: new Set(["application/msword", "application/octet-stream"]),
    docx: new Set([
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "application/octet-stream"
    ])
  };

  if (contentType && !allowedContentTypes[extension]?.has(contentType)) {
    throw new InvalidFileError("Uploaded file content type does not match DOC, DOCX, or PDF.");
  }

  return {
    normalizedCategory: "abstracts",
    extension,
    contentType: contentType || "application/octet-stream",
    originalFileName
  };
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function generateFileUrl(objectKey) {
  validateS3Configuration();
  const normalizedKey = validateObjectKey(objectKey);
  return `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com/${encodeObjectKey(normalizedKey)}`;
}

export async function uploadManagedFile({ file, category, user }) {
  validateS3Configuration();
  const { normalizedCategory, extension, contentType, originalFileName } = validateManagedFile(file, category);

  if (normalizedCategory === "certificates" && !user.roles.includes("ADMIN")) {
    throw new AccessDeniedError("Only ADMIN users can upload certificate files");
  }

  const generatedFileName = `${crypto.randomUUID()}.${extension}`;
  const objectKey = `${normalizedCategory}/${generatedFileName}`;
  const uploadedAt = new Date().toISOString();

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.awsBucketName,
        Key: objectKey,
        Body: file.buffer,
        ContentType: contentType,
        ContentLength: file.size,
        Metadata: {
          "original-file-name": originalFileName,
          "uploaded-by": user.email,
          "upload-category": normalizedCategory
        }
      })
    );
  } catch (error) {
    throw new FileStorageError(`Failed to upload file to AWS S3: ${error.message || "Unknown AWS error"}`);
  }

  return {
    fileName: objectKey,
    fileUrl: generateFileUrl(objectKey),
    fileType: contentType,
    size: file.size,
    uploadedAt
  };
}

export async function uploadAbstractFile({ file, referenceCode }) {
  validateS3Configuration();
  const { normalizedCategory, extension, contentType, originalFileName } = validateAbstractStorageFile(file);
  const generatedFileName = `${referenceCode.toLowerCase()}-${crypto.randomUUID()}.${extension}`;
  const objectKey = `${normalizedCategory}/${generatedFileName}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.awsBucketName,
        Key: objectKey,
        Body: file.buffer,
        ContentType: contentType,
        ContentLength: file.size,
        Metadata: {
          "original-file-name": originalFileName,
          "upload-category": normalizedCategory,
          "reference-code": referenceCode
        }
      })
    );
  } catch (error) {
    throw new FileStorageError(`Failed to upload file to AWS S3: ${error.message || "Unknown AWS error"}`);
  }

  return {
    fileKey: objectKey,
    fileName: originalFileName,
    fileType: contentType,
    fileSize: file.size
  };
}

export async function downloadFileFromS3(objectKey) {
  validateS3Configuration();
  const normalizedKey = validateObjectKey(objectKey);

  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: config.awsBucketName,
        Key: normalizedKey
      })
    );

    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    throw new FileStorageError(`Failed to download file from AWS S3: ${error.message || "Unknown AWS error"}`);
  }
}

export async function deleteManagedFile(objectKey, user) {
  validateS3Configuration();
  if (!user.roles.includes("ADMIN") && !user.roles.includes("ORGANIZER")) {
    throw new AccessDeniedError("Only ADMIN or ORGANIZER users can delete uploaded files");
  }

  const normalizedKey = validateObjectKey(objectKey);

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.awsBucketName,
        Key: normalizedKey
      })
    );
  } catch (error) {
    throw new FileStorageError(`Failed to delete file from AWS S3: ${error.message || "Unknown AWS error"}`);
  }
}

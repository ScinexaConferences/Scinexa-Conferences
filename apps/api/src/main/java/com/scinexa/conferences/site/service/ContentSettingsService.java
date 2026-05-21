package com.scinexa.conferences.site.service;

import com.scinexa.conferences.site.dto.AbstractContentRequest;
import com.scinexa.conferences.site.dto.AbstractContentResponse;
import com.scinexa.conferences.site.dto.AboutContentRequest;
import com.scinexa.conferences.site.dto.AboutContentResponse;
import com.scinexa.conferences.site.dto.ContentSettingsRequest;
import com.scinexa.conferences.site.dto.ContentSettingsResponse;
import com.scinexa.conferences.site.dto.SessionContentItemRequest;
import com.scinexa.conferences.site.dto.SessionContentItemResponse;
import com.scinexa.conferences.site.dto.SessionsContentRequest;
import com.scinexa.conferences.site.dto.SessionsContentResponse;
import com.scinexa.conferences.site.entity.AbstractContent;
import com.scinexa.conferences.site.entity.AboutContent;
import com.scinexa.conferences.site.entity.ContentSettings;
import com.scinexa.conferences.site.entity.SessionContentItem;
import com.scinexa.conferences.site.entity.SessionsContent;
import com.scinexa.conferences.site.repository.ContentSettingsRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContentSettingsService {

    private final ContentSettingsRepository repository;

    public ContentSettingsResponse getPublicSettings() {
        return repository.findById(ContentSettings.SINGLETON_ID)
                .map(this::toResponse)
                .orElseGet(this::defaultResponse);
    }

    public ContentSettingsResponse update(ContentSettingsRequest request) {
        ContentSettings settings = repository.findById(ContentSettings.SINGLETON_ID)
                .orElseGet(() -> {
                    ContentSettings created = new ContentSettings();
                    created.setId(ContentSettings.SINGLETON_ID);
                    return created;
                });

        settings.setAbout(toEntity(request.about()));
        settings.setSessions(toEntity(request.sessions()));
        settings.setAbstractSection(toEntity(request.abstractSection()));
        return toResponse(repository.save(settings));
    }

    private ContentSettingsResponse defaultResponse() {
        return new ContentSettingsResponse(
                new AboutContentResponse(
                        "About This Conference",
                        "A sharper scientific meeting experience built for serious collaboration",
                        "Inspired by premium congress layouts, this section frames the event as more than a registration page. It presents the conference as a destination for research exchange, practical insight, and long-tail professional relationships.",
                        "https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1200&q=80",
                        "Host City",
                        "Singapore Expo Convention Centre",
                        "September 18-20, 2026",
                        "Read More About",
                        "/about",
                        List.of(
                                "3rd International Congress on Clinical Microbiology and Infectious Diseases is designed to bring together clinicians, microbiologists, infectious disease specialists, and translational researchers in a setting that feels focused, credible, and globally connected.",
                                "Across the program, delegates can move between keynote thinking, evidence-led breakout sessions, sponsor interaction, and peer conversations that carry useful ideas back into hospitals, laboratories, universities, and public health teams."
                        )
                ),
                new SessionsContentResponse(
                        "Sessions",
                        "Explore the scientific sessions shaping the full conference experience",
                        "A dedicated session library with day-based filtering, premium presentation, and clear paths into abstract and registration actions.",
                        "Submit Abstract",
                        "Share your work with the scientific committee.",
                        "Open",
                        "/abstract",
                        List.of(
                                new SessionContentItemResponse(
                                        "microbial-pathogenesis",
                                        "Microbial Pathogenesis",
                                        "Actionable methods and translational frameworks delegates can apply within modern microbiology programs.",
                                        "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
                                        "Hands-on Workshop",
                                        "Foundational",
                                        "Day-01",
                                        "View Details",
                                        "/abstract"
                                ),
                                new SessionContentItemResponse(
                                        "diagnostic-microbiology",
                                        "Diagnostic Microbiology",
                                        "Benchmark frameworks from top-performing labs and institutes with emphasis on workflow reliability.",
                                        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
                                        "Panel Discussion",
                                        "Advanced",
                                        "Day-01",
                                        "View Details",
                                        "/abstract"
                                ),
                                new SessionContentItemResponse(
                                        "infectious-diseases-forum",
                                        "Infectious Diseases",
                                        "Live examples mapping bench research to real-world implementation and clinical care pathways.",
                                        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
                                        "Case Study Forum",
                                        "Translational",
                                        "Day-02",
                                        "View Details",
                                        "/abstract"
                                ),
                                new SessionContentItemResponse(
                                        "antibiotic-resistance",
                                        "Antibiotic Resistance",
                                        "Cross-disciplinary insight for rapid experimentation cycles, governance, and implementation readiness.",
                                        "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
                                        "Rapid Fire Talk",
                                        "Policy and Implementation",
                                        "Day-02",
                                        "View Details",
                                        "/abstract"
                                ),
                                new SessionContentItemResponse(
                                        "viral-genomics",
                                        "Viral Genomics",
                                        "Actionable sequencing perspectives for surveillance, outbreak mapping, and collaborative response planning.",
                                        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
                                        "Hands-on Workshop",
                                        "Foundational",
                                        "Day-03",
                                        "View Details",
                                        "/abstract"
                                ),
                                new SessionContentItemResponse(
                                        "surveillance-networks",
                                        "Surveillance Networks",
                                        "Strategic conversations around reporting systems, regional visibility, and cross-institution coordination.",
                                        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
                                        "Roundtable",
                                        "Public Health",
                                        "Day-03",
                                        "View Details",
                                        "/abstract"
                                )
                        )
                ),
                new AbstractContentResponse(
                        "Abstract",
                        "Summary Of Your Presentation",
                        "Everything you need for preparing and submitting your abstract is included on this page.",
                        "Download Template",
                        "/downloads",
                        List.of(
                                "Abstract length should not exceed 300 words excluding title and author information.",
                                "Use clear sections: Background, Methods, Results, and Conclusion.",
                                "Title should be concise, sentence case, and centered.",
                                "List all affiliations below author names and mark presenting author with an asterisk.",
                                "Submit in English, using professional scientific terminology only.",
                                "Accepted file formats: DOC, DOCX, or PDF. Maximum file size: 5 MB.",
                                "References should be minimal and follow standard journal format.",
                                "Avoid plagiarism, fabricated data, and unsupported clinical claims.",
                                "All submissions are peer-reviewed and final decisions are shared by email."
                        ),
                        List.of(
                                "Microbial Pathogenesis",
                                "Diagnostic Microbiology",
                                "Infectious Diseases",
                                "Antibiotic Resistance",
                                "Viral Genomics",
                                "Clinical Immunology",
                                "Biofilms & Quorum Sensing",
                                "Zoonotic Diseases",
                                "Mycology & Parasitology",
                                "Public Health Microbiology"
                        ),
                        List.of(
                                "Use a descriptive title and keep the abstract below 300 words.",
                                "Select the nearest scientific track for proper reviewer assignment.",
                                "Avoid plagiarism and include only validated findings.",
                                "Upload DOC, DOCX, or PDF format with readable structure."
                        ),
                        List.of(
                                "Singapore",
                                "India",
                                "United States",
                                "United Kingdom",
                                "France",
                                "Germany",
                                "Australia",
                                "Japan",
                                "Canada",
                                "United Arab Emirates"
                        ),
                        List.of(
                                "Oral Presentation",
                                "Poster Presentation",
                                "Workshop Session",
                                "Case Study Forum"
                        ),
                        List.of("Dr.", "Prof.", "Mr.", "Ms.", "Mx.")
                )
        );
    }

    private ContentSettingsResponse toResponse(ContentSettings settings) {
        return new ContentSettingsResponse(
                toResponse(settings.getAbout()),
                toResponse(settings.getSessions()),
                toResponse(settings.getAbstractSection())
        );
    }

    private AboutContent toEntity(AboutContentRequest request) {
        AboutContent content = new AboutContent();
        content.setEyebrow(request.eyebrow().trim());
        content.setTitle(request.title().trim());
        content.setDescription(request.description().trim());
        content.setImage(request.image().trim());
        content.setOverlayLabel(request.overlayLabel().trim());
        content.setOverlayTitle(request.overlayTitle().trim());
        content.setOverlaySubtitle(request.overlaySubtitle().trim());
        content.setCtaLabel(request.ctaLabel().trim());
        content.setCtaTo(request.ctaTo().trim());
        content.setParagraphs(normalizeList(request.paragraphs()));
        return content;
    }

    private SessionsContent toEntity(SessionsContentRequest request) {
        SessionsContent content = new SessionsContent();
        content.setEyebrow(request.eyebrow().trim());
        content.setTitle(request.title().trim());
        content.setDescription(request.description().trim());
        content.setCtaTitle(request.ctaTitle().trim());
        content.setCtaDescription(request.ctaDescription().trim());
        content.setCtaLabel(request.ctaLabel().trim());
        content.setCtaTo(request.ctaTo().trim());
        content.setSessions(Optional.ofNullable(request.sessions()).orElse(List.of()).stream().map(this::toEntity).toList());
        return content;
    }

    private SessionContentItem toEntity(SessionContentItemRequest request) {
        SessionContentItem item = new SessionContentItem();
        item.setId(request.id() == null || request.id().isBlank() ? "session-" + UUID.randomUUID().toString().substring(0, 8) : request.id().trim());
        item.setTitle(request.title().trim());
        item.setDescription(request.description().trim());
        item.setImage(request.image().trim());
        item.setFormat(request.format().trim());
        item.setTrack(request.track().trim());
        item.setDay(request.day().trim());
        item.setActionLabel(request.actionLabel().trim());
        item.setActionTo(request.actionTo().trim());
        return item;
    }

    private AbstractContent toEntity(AbstractContentRequest request) {
        AbstractContent content = new AbstractContent();
        content.setEyebrow(request.eyebrow().trim());
        content.setTitle(request.title().trim());
        content.setDescription(request.description().trim());
        content.setTemplateLabel(request.templateLabel().trim());
        content.setTemplateTo(request.templateTo().trim());
        content.setGuidelines(normalizeList(request.guidelines()));
        content.setTopics(normalizeList(request.topics()));
        content.setBeforeSubmit(normalizeList(request.beforeSubmit()));
        content.setCountries(normalizeList(request.countries()));
        content.setPresentationTypes(normalizeList(request.presentationTypes()));
        content.setAuthorTitles(normalizeList(request.authorTitles()));
        return content;
    }

    private AboutContentResponse toResponse(AboutContent content) {
        AboutContent safeContent = content == null ? toEntity(defaultResponse().about()) : content;

        return new AboutContentResponse(
                safeContent.getEyebrow(),
                safeContent.getTitle(),
                safeContent.getDescription(),
                safeContent.getImage(),
                safeContent.getOverlayLabel(),
                safeContent.getOverlayTitle(),
                safeContent.getOverlaySubtitle(),
                safeContent.getCtaLabel(),
                safeContent.getCtaTo(),
                Optional.ofNullable(safeContent.getParagraphs()).orElse(List.of())
        );
    }

    private AboutContent toEntity(AboutContentResponse response) {
        AboutContent content = new AboutContent();
        content.setEyebrow(response.eyebrow());
        content.setTitle(response.title());
        content.setDescription(response.description());
        content.setImage(response.image());
        content.setOverlayLabel(response.overlayLabel());
        content.setOverlayTitle(response.overlayTitle());
        content.setOverlaySubtitle(response.overlaySubtitle());
        content.setCtaLabel(response.ctaLabel());
        content.setCtaTo(response.ctaTo());
        content.setParagraphs(response.paragraphs());
        return content;
    }

    private SessionsContentResponse toResponse(SessionsContent content) {
        SessionsContent safeContent = content == null ? toEntity(defaultResponse().sessions()) : content;

        return new SessionsContentResponse(
                safeContent.getEyebrow(),
                safeContent.getTitle(),
                safeContent.getDescription(),
                safeContent.getCtaTitle(),
                safeContent.getCtaDescription(),
                safeContent.getCtaLabel(),
                safeContent.getCtaTo(),
                Optional.ofNullable(safeContent.getSessions()).orElse(List.of()).stream().map(this::toResponse).toList()
        );
    }

    private SessionContentItemResponse toResponse(SessionContentItem item) {
        return new SessionContentItemResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getImage(),
                item.getFormat(),
                item.getTrack(),
                item.getDay(),
                item.getActionLabel(),
                item.getActionTo()
        );
    }

    private AbstractContentResponse toResponse(AbstractContent content) {
        AbstractContent safeContent = content == null ? toEntity(defaultResponse().abstractSection()) : content;

        return new AbstractContentResponse(
                safeContent.getEyebrow(),
                safeContent.getTitle(),
                safeContent.getDescription(),
                safeContent.getTemplateLabel(),
                safeContent.getTemplateTo(),
                Optional.ofNullable(safeContent.getGuidelines()).orElse(List.of()),
                Optional.ofNullable(safeContent.getTopics()).orElse(List.of()),
                Optional.ofNullable(safeContent.getBeforeSubmit()).orElse(List.of()),
                Optional.ofNullable(safeContent.getCountries()).orElse(List.of()),
                Optional.ofNullable(safeContent.getPresentationTypes()).orElse(List.of()),
                Optional.ofNullable(safeContent.getAuthorTitles()).orElse(List.of())
        );
    }

    private SessionsContent toEntity(SessionsContentResponse response) {
        SessionsContent content = new SessionsContent();
        content.setEyebrow(response.eyebrow());
        content.setTitle(response.title());
        content.setDescription(response.description());
        content.setCtaTitle(response.ctaTitle());
        content.setCtaDescription(response.ctaDescription());
        content.setCtaLabel(response.ctaLabel());
        content.setCtaTo(response.ctaTo());
        content.setSessions(Optional.ofNullable(response.sessions()).orElse(List.of()).stream().map(this::toEntity).toList());
        return content;
    }

    private SessionContentItem toEntity(SessionContentItemResponse response) {
        SessionContentItem item = new SessionContentItem();
        item.setId(response.id());
        item.setTitle(response.title());
        item.setDescription(response.description());
        item.setImage(response.image());
        item.setFormat(response.format());
        item.setTrack(response.track());
        item.setDay(response.day());
        item.setActionLabel(response.actionLabel());
        item.setActionTo(response.actionTo());
        return item;
    }

    private AbstractContent toEntity(AbstractContentResponse response) {
        AbstractContent content = new AbstractContent();
        content.setEyebrow(response.eyebrow());
        content.setTitle(response.title());
        content.setDescription(response.description());
        content.setTemplateLabel(response.templateLabel());
        content.setTemplateTo(response.templateTo());
        content.setGuidelines(response.guidelines());
        content.setTopics(response.topics());
        content.setBeforeSubmit(response.beforeSubmit());
        content.setCountries(response.countries());
        content.setPresentationTypes(response.presentationTypes());
        content.setAuthorTitles(response.authorTitles());
        return content;
    }

    private List<String> normalizeList(List<String> values) {
        return Optional.ofNullable(values).orElse(List.of()).stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();
    }
}

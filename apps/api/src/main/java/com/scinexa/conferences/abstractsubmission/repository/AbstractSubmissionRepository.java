package com.scinexa.conferences.abstractsubmission.repository;

import com.scinexa.conferences.abstractsubmission.entity.AbstractSubmission;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AbstractSubmissionRepository extends MongoRepository<AbstractSubmission, String> {

    List<AbstractSubmission> findAllByOrderByCreatedAtDesc();
}

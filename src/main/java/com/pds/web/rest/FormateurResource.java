package com.pds.web.rest;

import com.pds.domain.Formateur;
import com.pds.repository.FormateurRepository;
import com.pds.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.pds.domain.Formateur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormateurResource {

    private final Logger log = LoggerFactory.getLogger(FormateurResource.class);

    private static final String ENTITY_NAME = "formateur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormateurRepository formateurRepository;

    public FormateurResource(FormateurRepository formateurRepository) {
        this.formateurRepository = formateurRepository;
    }

    /**
     * {@code POST  /formateurs} : Create a new formateur.
     *
     * @param formateur the formateur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formateur, or with status {@code 400 (Bad Request)} if the formateur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/formateurs")
    public ResponseEntity<Formateur> createFormateur(@Valid @RequestBody Formateur formateur) throws URISyntaxException {
        log.debug("REST request to save Formateur : {}", formateur);
        if (formateur.getId() != null) {
            throw new BadRequestAlertException("A new formateur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Formateur result = formateurRepository.save(formateur);
        return ResponseEntity
            .created(new URI("/api/formateurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /formateurs/:id} : Updates an existing formateur.
     *
     * @param id the id of the formateur to save.
     * @param formateur the formateur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formateur,
     * or with status {@code 400 (Bad Request)} if the formateur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formateur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/formateurs/{id}")
    public ResponseEntity<Formateur> updateFormateur(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Formateur formateur
    ) throws URISyntaxException {
        log.debug("REST request to update Formateur : {}, {}", id, formateur);
        if (formateur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formateur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formateurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Formateur result = formateurRepository.save(formateur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formateur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /formateurs/:id} : Partial updates given fields of an existing formateur, field will ignore if it is null
     *
     * @param id the id of the formateur to save.
     * @param formateur the formateur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formateur,
     * or with status {@code 400 (Bad Request)} if the formateur is not valid,
     * or with status {@code 404 (Not Found)} if the formateur is not found,
     * or with status {@code 500 (Internal Server Error)} if the formateur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/formateurs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Formateur> partialUpdateFormateur(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Formateur formateur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Formateur partially : {}, {}", id, formateur);
        if (formateur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formateur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formateurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Formateur> result = formateurRepository
            .findById(formateur.getId())
            .map(
                existingFormateur -> {
                    if (formateur.getNom() != null) {
                        existingFormateur.setNom(formateur.getNom());
                    }
                    if (formateur.getPrenom() != null) {
                        existingFormateur.setPrenom(formateur.getPrenom());
                    }

                    return existingFormateur;
                }
            )
            .map(formateurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formateur.getId().toString())
        );
    }

    /**
     * {@code GET  /formateurs} : get all the formateurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formateurs in body.
     */
    @GetMapping("/formateurs")
    public List<Formateur> getAllFormateurs() {
        log.debug("REST request to get all Formateurs");
        return formateurRepository.findAll();
    }

    /**
     * {@code GET  /formateurs/:id} : get the "id" formateur.
     *
     * @param id the id of the formateur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formateur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/formateurs/{id}")
    public ResponseEntity<Formateur> getFormateur(@PathVariable Long id) {
        log.debug("REST request to get Formateur : {}", id);
        Optional<Formateur> formateur = formateurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formateur);
    }

    /**
     * {@code DELETE  /formateurs/:id} : delete the "id" formateur.
     *
     * @param id the id of the formateur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/formateurs/{id}")
    public ResponseEntity<Void> deleteFormateur(@PathVariable Long id) {
        log.debug("REST request to delete Formateur : {}", id);
        formateurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

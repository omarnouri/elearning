package com.pds.web.rest;

import com.pds.domain.Matiere;
import com.pds.repository.MatiereRepository;
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
 * REST controller for managing {@link com.pds.domain.Matiere}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MatiereResource {

    private final Logger log = LoggerFactory.getLogger(MatiereResource.class);

    private static final String ENTITY_NAME = "matiere";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MatiereRepository matiereRepository;

    public MatiereResource(MatiereRepository matiereRepository) {
        this.matiereRepository = matiereRepository;
    }

    /**
     * {@code POST  /matieres} : Create a new matiere.
     *
     * @param matiere the matiere to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new matiere, or with status {@code 400 (Bad Request)} if the matiere has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/matieres")
    public ResponseEntity<Matiere> createMatiere(@Valid @RequestBody Matiere matiere) throws URISyntaxException {
        log.debug("REST request to save Matiere : {}", matiere);
        if (matiere.getId() != null) {
            throw new BadRequestAlertException("A new matiere cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Matiere result = matiereRepository.save(matiere);
        return ResponseEntity
            .created(new URI("/api/matieres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /matieres/:id} : Updates an existing matiere.
     *
     * @param id the id of the matiere to save.
     * @param matiere the matiere to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matiere,
     * or with status {@code 400 (Bad Request)} if the matiere is not valid,
     * or with status {@code 500 (Internal Server Error)} if the matiere couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/matieres/{id}")
    public ResponseEntity<Matiere> updateMatiere(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Matiere matiere
    ) throws URISyntaxException {
        log.debug("REST request to update Matiere : {}, {}", id, matiere);
        if (matiere.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, matiere.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matiereRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Matiere result = matiereRepository.save(matiere);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matiere.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /matieres/:id} : Partial updates given fields of an existing matiere, field will ignore if it is null
     *
     * @param id the id of the matiere to save.
     * @param matiere the matiere to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matiere,
     * or with status {@code 400 (Bad Request)} if the matiere is not valid,
     * or with status {@code 404 (Not Found)} if the matiere is not found,
     * or with status {@code 500 (Internal Server Error)} if the matiere couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/matieres/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Matiere> partialUpdateMatiere(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Matiere matiere
    ) throws URISyntaxException {
        log.debug("REST request to partial update Matiere partially : {}, {}", id, matiere);
        if (matiere.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, matiere.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matiereRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Matiere> result = matiereRepository
            .findById(matiere.getId())
            .map(
                existingMatiere -> {
                    if (matiere.getNom() != null) {
                        existingMatiere.setNom(matiere.getNom());
                    }
                    if (matiere.getDescription() != null) {
                        existingMatiere.setDescription(matiere.getDescription());
                    }

                    return existingMatiere;
                }
            )
            .map(matiereRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matiere.getId().toString())
        );
    }

    /**
     * {@code GET  /matieres} : get all the matieres.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matieres in body.
     */
    @GetMapping("/matieres")
    public List<Matiere> getAllMatieres() {
        log.debug("REST request to get all Matieres");
        return matiereRepository.findAll();
    }

    /**
     * {@code GET  /matieres/:id} : get the "id" matiere.
     *
     * @param id the id of the matiere to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the matiere, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/matieres/{id}")
    public ResponseEntity<Matiere> getMatiere(@PathVariable Long id) {
        log.debug("REST request to get Matiere : {}", id);
        Optional<Matiere> matiere = matiereRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(matiere);
    }

    /**
     * {@code DELETE  /matieres/:id} : delete the "id" matiere.
     *
     * @param id the id of the matiere to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/matieres/{id}")
    public ResponseEntity<Void> deleteMatiere(@PathVariable Long id) {
        log.debug("REST request to delete Matiere : {}", id);
        matiereRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

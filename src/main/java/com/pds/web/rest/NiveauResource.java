package com.pds.web.rest;

import com.pds.domain.Niveau;
import com.pds.repository.NiveauRepository;
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
 * REST controller for managing {@link com.pds.domain.Niveau}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NiveauResource {

    private final Logger log = LoggerFactory.getLogger(NiveauResource.class);

    private static final String ENTITY_NAME = "niveau";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NiveauRepository niveauRepository;

    public NiveauResource(NiveauRepository niveauRepository) {
        this.niveauRepository = niveauRepository;
    }

    /**
     * {@code POST  /niveaus} : Create a new niveau.
     *
     * @param niveau the niveau to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new niveau, or with status {@code 400 (Bad Request)} if the niveau has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/niveaus")
    public ResponseEntity<Niveau> createNiveau(@Valid @RequestBody Niveau niveau) throws URISyntaxException {
        log.debug("REST request to save Niveau : {}", niveau);
        if (niveau.getId() != null) {
            throw new BadRequestAlertException("A new niveau cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Niveau result = niveauRepository.save(niveau);
        return ResponseEntity
            .created(new URI("/api/niveaus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /niveaus/:id} : Updates an existing niveau.
     *
     * @param id the id of the niveau to save.
     * @param niveau the niveau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated niveau,
     * or with status {@code 400 (Bad Request)} if the niveau is not valid,
     * or with status {@code 500 (Internal Server Error)} if the niveau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/niveaus/{id}")
    public ResponseEntity<Niveau> updateNiveau(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Niveau niveau
    ) throws URISyntaxException {
        log.debug("REST request to update Niveau : {}, {}", id, niveau);
        if (niveau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, niveau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!niveauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Niveau result = niveauRepository.save(niveau);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, niveau.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /niveaus/:id} : Partial updates given fields of an existing niveau, field will ignore if it is null
     *
     * @param id the id of the niveau to save.
     * @param niveau the niveau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated niveau,
     * or with status {@code 400 (Bad Request)} if the niveau is not valid,
     * or with status {@code 404 (Not Found)} if the niveau is not found,
     * or with status {@code 500 (Internal Server Error)} if the niveau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/niveaus/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Niveau> partialUpdateNiveau(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Niveau niveau
    ) throws URISyntaxException {
        log.debug("REST request to partial update Niveau partially : {}, {}", id, niveau);
        if (niveau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, niveau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!niveauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Niveau> result = niveauRepository
            .findById(niveau.getId())
            .map(
                existingNiveau -> {
                    if (niveau.getLibelle() != null) {
                        existingNiveau.setLibelle(niveau.getLibelle());
                    }

                    return existingNiveau;
                }
            )
            .map(niveauRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, niveau.getId().toString())
        );
    }

    /**
     * {@code GET  /niveaus} : get all the niveaus.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of niveaus in body.
     */
    @GetMapping("/niveaus")
    public List<Niveau> getAllNiveaus() {
        log.debug("REST request to get all Niveaus");
        return niveauRepository.findAll();
    }

    /**
     * {@code GET  /niveaus/:id} : get the "id" niveau.
     *
     * @param id the id of the niveau to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the niveau, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/niveaus/{id}")
    public ResponseEntity<Niveau> getNiveau(@PathVariable Long id) {
        log.debug("REST request to get Niveau : {}", id);
        Optional<Niveau> niveau = niveauRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(niveau);
    }

    /**
     * {@code DELETE  /niveaus/:id} : delete the "id" niveau.
     *
     * @param id the id of the niveau to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/niveaus/{id}")
    public ResponseEntity<Void> deleteNiveau(@PathVariable Long id) {
        log.debug("REST request to delete Niveau : {}", id);
        niveauRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

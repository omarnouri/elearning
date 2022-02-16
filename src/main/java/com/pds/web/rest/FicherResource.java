package com.pds.web.rest;

import com.pds.domain.Ficher;
import com.pds.repository.FicherRepository;
import com.pds.service.FicherService;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.pds.domain.Ficher}.
 */
@RestController
@RequestMapping("/api")
public class FicherResource {

    private final Logger log = LoggerFactory.getLogger(FicherResource.class);

    private static final String ENTITY_NAME = "ficher";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FicherService ficherService;

    private final FicherRepository ficherRepository;

    public FicherResource(FicherService ficherService, FicherRepository ficherRepository) {
        this.ficherService = ficherService;
        this.ficherRepository = ficherRepository;
    }

    /**
     * {@code POST  /fichers} : Create a new ficher.
     *
     * @param ficher the ficher to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ficher, or with status {@code 400 (Bad Request)} if the ficher has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fichers")
    public ResponseEntity<Ficher> createFicher(@Valid @RequestBody Ficher ficher) throws URISyntaxException {
        log.debug("REST request to save Ficher : {}", ficher);
        if (ficher.getId() != null) {
            throw new BadRequestAlertException("A new ficher cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ficher result = ficherService.save(ficher);
        return ResponseEntity
            .created(new URI("/api/fichers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fichers/:id} : Updates an existing ficher.
     *
     * @param id the id of the ficher to save.
     * @param ficher the ficher to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ficher,
     * or with status {@code 400 (Bad Request)} if the ficher is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ficher couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fichers/{id}")
    public ResponseEntity<Ficher> updateFicher(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Ficher ficher
    ) throws URISyntaxException {
        log.debug("REST request to update Ficher : {}, {}", id, ficher);
        if (ficher.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ficher.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ficherRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ficher result = ficherService.save(ficher);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ficher.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fichers/:id} : Partial updates given fields of an existing ficher, field will ignore if it is null
     *
     * @param id the id of the ficher to save.
     * @param ficher the ficher to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ficher,
     * or with status {@code 400 (Bad Request)} if the ficher is not valid,
     * or with status {@code 404 (Not Found)} if the ficher is not found,
     * or with status {@code 500 (Internal Server Error)} if the ficher couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fichers/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Ficher> partialUpdateFicher(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Ficher ficher
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ficher partially : {}, {}", id, ficher);
        if (ficher.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ficher.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ficherRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ficher> result = ficherService.partialUpdate(ficher);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ficher.getId().toString())
        );
    }

    /**
     * {@code GET  /fichers} : get all the fichers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fichers in body.
     */
    @GetMapping("/fichers")
    public List<Ficher> getAllFichers() {
        log.debug("REST request to get all Fichers");
        return ficherService.findAll();
    }

    /**
     * {@code GET  /fichers/:id} : get the "id" ficher.
     *
     * @param id the id of the ficher to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ficher, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fichers/{id}")
    public ResponseEntity<Ficher> getFicher(@PathVariable Long id) {
        log.debug("REST request to get Ficher : {}", id);
        Optional<Ficher> ficher = ficherService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ficher);
    }

    /**
     * {@code DELETE  /fichers/:id} : delete the "id" ficher.
     *
     * @param id the id of the ficher to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fichers/{id}")
    public ResponseEntity<Void> deleteFicher(@PathVariable Long id) {
        log.debug("REST request to delete Ficher : {}", id);
        ficherService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

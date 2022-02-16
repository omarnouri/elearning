package com.pds.service;

import com.pds.domain.Ficher;
import com.pds.repository.FicherRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Ficher}.
 */
@Service
@Transactional
public class FicherService {

    private final Logger log = LoggerFactory.getLogger(FicherService.class);

    private final FicherRepository ficherRepository;

    public FicherService(FicherRepository ficherRepository) {
        this.ficherRepository = ficherRepository;
    }

    /**
     * Save a ficher.
     *
     * @param ficher the entity to save.
     * @return the persisted entity.
     */
    public Ficher save(Ficher ficher) {
        log.debug("Request to save Ficher : {}", ficher);
        return ficherRepository.save(ficher);
    }

    /**
     * Partially update a ficher.
     *
     * @param ficher the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Ficher> partialUpdate(Ficher ficher) {
        log.debug("Request to partially update Ficher : {}", ficher);

        return ficherRepository
            .findById(ficher.getId())
            .map(
                existingFicher -> {
                    if (ficher.getNom() != null) {
                        existingFicher.setNom(ficher.getNom());
                    }
                    if (ficher.getFile() != null) {
                        existingFicher.setFile(ficher.getFile());
                    }
                    if (ficher.getFileContentType() != null) {
                        existingFicher.setFileContentType(ficher.getFileContentType());
                    }

                    return existingFicher;
                }
            )
            .map(ficherRepository::save);
    }

    /**
     * Get all the fichers.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Ficher> findAll() {
        log.debug("Request to get all Fichers");
        return ficherRepository.findAll();
    }

    /**
     * Get one ficher by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Ficher> findOne(Long id) {
        log.debug("Request to get Ficher : {}", id);
        return ficherRepository.findById(id);
    }

    /**
     * Delete the ficher by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Ficher : {}", id);
        ficherRepository.deleteById(id);
    }
}

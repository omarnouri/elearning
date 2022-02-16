package com.pds.service;

import com.pds.domain.Formateur;
import com.pds.repository.FormateurRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Formateur}.
 */
@Service
@Transactional
public class FormateurService {

    private final Logger log = LoggerFactory.getLogger(FormateurService.class);

    private final FormateurRepository formateurRepository;

    public FormateurService(FormateurRepository formateurRepository) {
        this.formateurRepository = formateurRepository;
    }

    /**
     * Save a formateur.
     *
     * @param formateur the entity to save.
     * @return the persisted entity.
     */
    public Formateur save(Formateur formateur) {
        log.debug("Request to save Formateur : {}", formateur);
        return formateurRepository.save(formateur);
    }

    /**
     * Partially update a formateur.
     *
     * @param formateur the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Formateur> partialUpdate(Formateur formateur) {
        log.debug("Request to partially update Formateur : {}", formateur);

        return formateurRepository
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
    }

    /**
     * Get all the formateurs.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Formateur> findAll() {
        log.debug("Request to get all Formateurs");
        return formateurRepository.findAll();
    }

    /**
     * Get one formateur by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Formateur> findOne(Long id) {
        log.debug("Request to get Formateur : {}", id);
        return formateurRepository.findById(id);
    }

    /**
     * Delete the formateur by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Formateur : {}", id);
        formateurRepository.deleteById(id);
    }
}

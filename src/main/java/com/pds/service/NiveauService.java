package com.pds.service;

import com.pds.domain.Niveau;
import com.pds.repository.NiveauRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Niveau}.
 */
@Service
@Transactional
public class NiveauService {

    private final Logger log = LoggerFactory.getLogger(NiveauService.class);

    private final NiveauRepository niveauRepository;

    public NiveauService(NiveauRepository niveauRepository) {
        this.niveauRepository = niveauRepository;
    }

    /**
     * Save a niveau.
     *
     * @param niveau the entity to save.
     * @return the persisted entity.
     */
    public Niveau save(Niveau niveau) {
        log.debug("Request to save Niveau : {}", niveau);
        return niveauRepository.save(niveau);
    }

    /**
     * Partially update a niveau.
     *
     * @param niveau the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Niveau> partialUpdate(Niveau niveau) {
        log.debug("Request to partially update Niveau : {}", niveau);

        return niveauRepository
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
    }

    /**
     * Get all the niveaus.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Niveau> findAll() {
        log.debug("Request to get all Niveaus");
        return niveauRepository.findAll();
    }

    /**
     * Get one niveau by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Niveau> findOne(Long id) {
        log.debug("Request to get Niveau : {}", id);
        return niveauRepository.findById(id);
    }

    /**
     * Delete the niveau by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Niveau : {}", id);
        niveauRepository.deleteById(id);
    }
}

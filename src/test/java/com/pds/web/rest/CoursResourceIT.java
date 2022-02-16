package com.pds.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pds.IntegrationTest;
import com.pds.domain.Cours;
import com.pds.repository.CoursRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CoursResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CoursResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_AJOUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_AJOUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/cours";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CoursRepository coursRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCoursMockMvc;

    private Cours cours;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cours createEntity(EntityManager em) {
        Cours cours = new Cours().titre(DEFAULT_TITRE).description(DEFAULT_DESCRIPTION).dateAjout(DEFAULT_DATE_AJOUT);
        return cours;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cours createUpdatedEntity(EntityManager em) {
        Cours cours = new Cours().titre(UPDATED_TITRE).description(UPDATED_DESCRIPTION).dateAjout(UPDATED_DATE_AJOUT);
        return cours;
    }

    @BeforeEach
    public void initTest() {
        cours = createEntity(em);
    }

    @Test
    @Transactional
    void createCours() throws Exception {
        int databaseSizeBeforeCreate = coursRepository.findAll().size();
        // Create the Cours
        restCoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cours)))
            .andExpect(status().isCreated());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeCreate + 1);
        Cours testCours = coursList.get(coursList.size() - 1);
        assertThat(testCours.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testCours.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCours.getDateAjout()).isEqualTo(DEFAULT_DATE_AJOUT);
    }

    @Test
    @Transactional
    void createCoursWithExistingId() throws Exception {
        // Create the Cours with an existing ID
        cours.setId(1L);

        int databaseSizeBeforeCreate = coursRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cours)))
            .andExpect(status().isBadRequest());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitreIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursRepository.findAll().size();
        // set the field null
        cours.setTitre(null);

        // Create the Cours, which fails.

        restCoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cours)))
            .andExpect(status().isBadRequest());

        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCours() throws Exception {
        // Initialize the database
        coursRepository.saveAndFlush(cours);

        // Get all the coursList
        restCoursMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cours.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dateAjout").value(hasItem(DEFAULT_DATE_AJOUT.toString())));
    }

    @Test
    @Transactional
    void getCours() throws Exception {
        // Initialize the database
        coursRepository.saveAndFlush(cours);

        // Get the cours
        restCoursMockMvc
            .perform(get(ENTITY_API_URL_ID, cours.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cours.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.dateAjout").value(DEFAULT_DATE_AJOUT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCours() throws Exception {
        // Get the cours
        restCoursMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCours() throws Exception {
        // Initialize the database
        coursRepository.saveAndFlush(cours);

        int databaseSizeBeforeUpdate = coursRepository.findAll().size();

        // Update the cours
        Cours updatedCours = coursRepository.findById(cours.getId()).get();
        // Disconnect from session so that the updates on updatedCours are not directly saved in db
        em.detach(updatedCours);
        updatedCours.titre(UPDATED_TITRE).description(UPDATED_DESCRIPTION).dateAjout(UPDATED_DATE_AJOUT);

        restCoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCours.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCours))
            )
            .andExpect(status().isOk());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
        Cours testCours = coursList.get(coursList.size() - 1);
        assertThat(testCours.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testCours.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCours.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void putNonExistingCours() throws Exception {
        int databaseSizeBeforeUpdate = coursRepository.findAll().size();
        cours.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cours.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCours() throws Exception {
        int databaseSizeBeforeUpdate = coursRepository.findAll().size();
        cours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCours() throws Exception {
        int databaseSizeBeforeUpdate = coursRepository.findAll().size();
        cours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cours)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCoursWithPatch() throws Exception {
        // Initialize the database
        coursRepository.saveAndFlush(cours);

        int databaseSizeBeforeUpdate = coursRepository.findAll().size();

        // Update the cours using partial update
        Cours partialUpdatedCours = new Cours();
        partialUpdatedCours.setId(cours.getId());

        restCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCours))
            )
            .andExpect(status().isOk());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
        Cours testCours = coursList.get(coursList.size() - 1);
        assertThat(testCours.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testCours.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCours.getDateAjout()).isEqualTo(DEFAULT_DATE_AJOUT);
    }

    @Test
    @Transactional
    void fullUpdateCoursWithPatch() throws Exception {
        // Initialize the database
        coursRepository.saveAndFlush(cours);

        int databaseSizeBeforeUpdate = coursRepository.findAll().size();

        // Update the cours using partial update
        Cours partialUpdatedCours = new Cours();
        partialUpdatedCours.setId(cours.getId());

        partialUpdatedCours.titre(UPDATED_TITRE).description(UPDATED_DESCRIPTION).dateAjout(UPDATED_DATE_AJOUT);

        restCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCours))
            )
            .andExpect(status().isOk());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
        Cours testCours = coursList.get(coursList.size() - 1);
        assertThat(testCours.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testCours.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCours.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void patchNonExistingCours() throws Exception {
        int databaseSizeBeforeUpdate = coursRepository.findAll().size();
        cours.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCours() throws Exception {
        int databaseSizeBeforeUpdate = coursRepository.findAll().size();
        cours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCours() throws Exception {
        int databaseSizeBeforeUpdate = coursRepository.findAll().size();
        cours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cours)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cours in the database
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCours() throws Exception {
        // Initialize the database
        coursRepository.saveAndFlush(cours);

        int databaseSizeBeforeDelete = coursRepository.findAll().size();

        // Delete the cours
        restCoursMockMvc
            .perform(delete(ENTITY_API_URL_ID, cours.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cours> coursList = coursRepository.findAll();
        assertThat(coursList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

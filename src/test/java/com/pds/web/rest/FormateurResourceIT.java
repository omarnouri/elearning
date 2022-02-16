package com.pds.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pds.IntegrationTest;
import com.pds.domain.Formateur;
import com.pds.repository.FormateurRepository;
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
 * Integration tests for the {@link FormateurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormateurResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/formateurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormateurMockMvc;

    private Formateur formateur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Formateur createEntity(EntityManager em) {
        Formateur formateur = new Formateur().nom(DEFAULT_NOM).prenom(DEFAULT_PRENOM);
        return formateur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Formateur createUpdatedEntity(EntityManager em) {
        Formateur formateur = new Formateur().nom(UPDATED_NOM).prenom(UPDATED_PRENOM);
        return formateur;
    }

    @BeforeEach
    public void initTest() {
        formateur = createEntity(em);
    }

    @Test
    @Transactional
    void createFormateur() throws Exception {
        int databaseSizeBeforeCreate = formateurRepository.findAll().size();
        // Create the Formateur
        restFormateurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formateur)))
            .andExpect(status().isCreated());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeCreate + 1);
        Formateur testFormateur = formateurList.get(formateurList.size() - 1);
        assertThat(testFormateur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testFormateur.getPrenom()).isEqualTo(DEFAULT_PRENOM);
    }

    @Test
    @Transactional
    void createFormateurWithExistingId() throws Exception {
        // Create the Formateur with an existing ID
        formateur.setId(1L);

        int databaseSizeBeforeCreate = formateurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormateurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formateur)))
            .andExpect(status().isBadRequest());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = formateurRepository.findAll().size();
        // set the field null
        formateur.setNom(null);

        // Create the Formateur, which fails.

        restFormateurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formateur)))
            .andExpect(status().isBadRequest());

        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrenomIsRequired() throws Exception {
        int databaseSizeBeforeTest = formateurRepository.findAll().size();
        // set the field null
        formateur.setPrenom(null);

        // Create the Formateur, which fails.

        restFormateurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formateur)))
            .andExpect(status().isBadRequest());

        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFormateurs() throws Exception {
        // Initialize the database
        formateurRepository.saveAndFlush(formateur);

        // Get all the formateurList
        restFormateurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formateur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)));
    }

    @Test
    @Transactional
    void getFormateur() throws Exception {
        // Initialize the database
        formateurRepository.saveAndFlush(formateur);

        // Get the formateur
        restFormateurMockMvc
            .perform(get(ENTITY_API_URL_ID, formateur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formateur.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM));
    }

    @Test
    @Transactional
    void getNonExistingFormateur() throws Exception {
        // Get the formateur
        restFormateurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormateur() throws Exception {
        // Initialize the database
        formateurRepository.saveAndFlush(formateur);

        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();

        // Update the formateur
        Formateur updatedFormateur = formateurRepository.findById(formateur.getId()).get();
        // Disconnect from session so that the updates on updatedFormateur are not directly saved in db
        em.detach(updatedFormateur);
        updatedFormateur.nom(UPDATED_NOM).prenom(UPDATED_PRENOM);

        restFormateurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormateur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormateur))
            )
            .andExpect(status().isOk());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
        Formateur testFormateur = formateurList.get(formateurList.size() - 1);
        assertThat(testFormateur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFormateur.getPrenom()).isEqualTo(UPDATED_PRENOM);
    }

    @Test
    @Transactional
    void putNonExistingFormateur() throws Exception {
        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();
        formateur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormateurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formateur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formateur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormateur() throws Exception {
        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();
        formateur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormateurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formateur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormateur() throws Exception {
        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();
        formateur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormateurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formateur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormateurWithPatch() throws Exception {
        // Initialize the database
        formateurRepository.saveAndFlush(formateur);

        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();

        // Update the formateur using partial update
        Formateur partialUpdatedFormateur = new Formateur();
        partialUpdatedFormateur.setId(formateur.getId());

        partialUpdatedFormateur.prenom(UPDATED_PRENOM);

        restFormateurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormateur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormateur))
            )
            .andExpect(status().isOk());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
        Formateur testFormateur = formateurList.get(formateurList.size() - 1);
        assertThat(testFormateur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testFormateur.getPrenom()).isEqualTo(UPDATED_PRENOM);
    }

    @Test
    @Transactional
    void fullUpdateFormateurWithPatch() throws Exception {
        // Initialize the database
        formateurRepository.saveAndFlush(formateur);

        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();

        // Update the formateur using partial update
        Formateur partialUpdatedFormateur = new Formateur();
        partialUpdatedFormateur.setId(formateur.getId());

        partialUpdatedFormateur.nom(UPDATED_NOM).prenom(UPDATED_PRENOM);

        restFormateurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormateur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormateur))
            )
            .andExpect(status().isOk());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
        Formateur testFormateur = formateurList.get(formateurList.size() - 1);
        assertThat(testFormateur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFormateur.getPrenom()).isEqualTo(UPDATED_PRENOM);
    }

    @Test
    @Transactional
    void patchNonExistingFormateur() throws Exception {
        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();
        formateur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormateurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formateur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formateur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormateur() throws Exception {
        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();
        formateur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormateurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formateur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormateur() throws Exception {
        int databaseSizeBeforeUpdate = formateurRepository.findAll().size();
        formateur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormateurMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(formateur))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Formateur in the database
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormateur() throws Exception {
        // Initialize the database
        formateurRepository.saveAndFlush(formateur);

        int databaseSizeBeforeDelete = formateurRepository.findAll().size();

        // Delete the formateur
        restFormateurMockMvc
            .perform(delete(ENTITY_API_URL_ID, formateur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Formateur> formateurList = formateurRepository.findAll();
        assertThat(formateurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

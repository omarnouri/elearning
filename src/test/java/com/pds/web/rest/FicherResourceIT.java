package com.pds.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pds.IntegrationTest;
import com.pds.domain.Ficher;
import com.pds.repository.FicherRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link FicherResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FicherResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final byte[] DEFAULT_FILE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FILE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FILE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FILE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/fichers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FicherRepository ficherRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFicherMockMvc;

    private Ficher ficher;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ficher createEntity(EntityManager em) {
        Ficher ficher = new Ficher().nom(DEFAULT_NOM).file(DEFAULT_FILE).fileContentType(DEFAULT_FILE_CONTENT_TYPE);
        return ficher;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ficher createUpdatedEntity(EntityManager em) {
        Ficher ficher = new Ficher().nom(UPDATED_NOM).file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE);
        return ficher;
    }

    @BeforeEach
    public void initTest() {
        ficher = createEntity(em);
    }

    @Test
    @Transactional
    void createFicher() throws Exception {
        int databaseSizeBeforeCreate = ficherRepository.findAll().size();
        // Create the Ficher
        restFicherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficher)))
            .andExpect(status().isCreated());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeCreate + 1);
        Ficher testFicher = ficherList.get(ficherList.size() - 1);
        assertThat(testFicher.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testFicher.getFile()).isEqualTo(DEFAULT_FILE);
        assertThat(testFicher.getFileContentType()).isEqualTo(DEFAULT_FILE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createFicherWithExistingId() throws Exception {
        // Create the Ficher with an existing ID
        ficher.setId(1L);

        int databaseSizeBeforeCreate = ficherRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFicherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficher)))
            .andExpect(status().isBadRequest());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = ficherRepository.findAll().size();
        // set the field null
        ficher.setNom(null);

        // Create the Ficher, which fails.

        restFicherMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficher)))
            .andExpect(status().isBadRequest());

        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFichers() throws Exception {
        // Initialize the database
        ficherRepository.saveAndFlush(ficher);

        // Get all the ficherList
        restFicherMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ficher.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].fileContentType").value(hasItem(DEFAULT_FILE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].file").value(hasItem(Base64Utils.encodeToString(DEFAULT_FILE))));
    }

    @Test
    @Transactional
    void getFicher() throws Exception {
        // Initialize the database
        ficherRepository.saveAndFlush(ficher);

        // Get the ficher
        restFicherMockMvc
            .perform(get(ENTITY_API_URL_ID, ficher.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ficher.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.fileContentType").value(DEFAULT_FILE_CONTENT_TYPE))
            .andExpect(jsonPath("$.file").value(Base64Utils.encodeToString(DEFAULT_FILE)));
    }

    @Test
    @Transactional
    void getNonExistingFicher() throws Exception {
        // Get the ficher
        restFicherMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFicher() throws Exception {
        // Initialize the database
        ficherRepository.saveAndFlush(ficher);

        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();

        // Update the ficher
        Ficher updatedFicher = ficherRepository.findById(ficher.getId()).get();
        // Disconnect from session so that the updates on updatedFicher are not directly saved in db
        em.detach(updatedFicher);
        updatedFicher.nom(UPDATED_NOM).file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE);

        restFicherMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFicher.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFicher))
            )
            .andExpect(status().isOk());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
        Ficher testFicher = ficherList.get(ficherList.size() - 1);
        assertThat(testFicher.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFicher.getFile()).isEqualTo(UPDATED_FILE);
        assertThat(testFicher.getFileContentType()).isEqualTo(UPDATED_FILE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingFicher() throws Exception {
        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();
        ficher.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFicherMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ficher.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ficher))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFicher() throws Exception {
        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();
        ficher.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicherMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ficher))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFicher() throws Exception {
        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();
        ficher.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicherMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficher)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFicherWithPatch() throws Exception {
        // Initialize the database
        ficherRepository.saveAndFlush(ficher);

        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();

        // Update the ficher using partial update
        Ficher partialUpdatedFicher = new Ficher();
        partialUpdatedFicher.setId(ficher.getId());

        partialUpdatedFicher.nom(UPDATED_NOM);

        restFicherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFicher.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFicher))
            )
            .andExpect(status().isOk());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
        Ficher testFicher = ficherList.get(ficherList.size() - 1);
        assertThat(testFicher.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFicher.getFile()).isEqualTo(DEFAULT_FILE);
        assertThat(testFicher.getFileContentType()).isEqualTo(DEFAULT_FILE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateFicherWithPatch() throws Exception {
        // Initialize the database
        ficherRepository.saveAndFlush(ficher);

        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();

        // Update the ficher using partial update
        Ficher partialUpdatedFicher = new Ficher();
        partialUpdatedFicher.setId(ficher.getId());

        partialUpdatedFicher.nom(UPDATED_NOM).file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE);

        restFicherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFicher.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFicher))
            )
            .andExpect(status().isOk());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
        Ficher testFicher = ficherList.get(ficherList.size() - 1);
        assertThat(testFicher.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testFicher.getFile()).isEqualTo(UPDATED_FILE);
        assertThat(testFicher.getFileContentType()).isEqualTo(UPDATED_FILE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingFicher() throws Exception {
        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();
        ficher.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFicherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ficher.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ficher))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFicher() throws Exception {
        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();
        ficher.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicherMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ficher))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFicher() throws Exception {
        int databaseSizeBeforeUpdate = ficherRepository.findAll().size();
        ficher.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFicherMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ficher)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ficher in the database
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFicher() throws Exception {
        // Initialize the database
        ficherRepository.saveAndFlush(ficher);

        int databaseSizeBeforeDelete = ficherRepository.findAll().size();

        // Delete the ficher
        restFicherMockMvc
            .perform(delete(ENTITY_API_URL_ID, ficher.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ficher> ficherList = ficherRepository.findAll();
        assertThat(ficherList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.pds.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.pds.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FicherTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ficher.class);
        Ficher ficher1 = new Ficher();
        ficher1.setId(1L);
        Ficher ficher2 = new Ficher();
        ficher2.setId(ficher1.getId());
        assertThat(ficher1).isEqualTo(ficher2);
        ficher2.setId(2L);
        assertThat(ficher1).isNotEqualTo(ficher2);
        ficher1.setId(null);
        assertThat(ficher1).isNotEqualTo(ficher2);
    }
}

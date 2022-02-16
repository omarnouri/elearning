package com.pds.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Niveau.
 */
@Entity
@Table(name = "niveau")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Niveau implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "libelle", nullable = false)
    private String libelle;

    @OneToMany(mappedBy = "niveau")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "niveau" }, allowSetters = true)
    private Set<Etudiant> etudiants = new HashSet<>();

    @OneToMany(mappedBy = "niveau")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cours", "formateur", "niveau" }, allowSetters = true)
    private Set<Matiere> matieres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Niveau id(Long id) {
        this.id = id;
        return this;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Niveau libelle(String libelle) {
        this.libelle = libelle;
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<Etudiant> getEtudiants() {
        return this.etudiants;
    }

    public Niveau etudiants(Set<Etudiant> etudiants) {
        this.setEtudiants(etudiants);
        return this;
    }

    public Niveau addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
        etudiant.setNiveau(this);
        return this;
    }

    public Niveau removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
        etudiant.setNiveau(null);
        return this;
    }

    public void setEtudiants(Set<Etudiant> etudiants) {
        if (this.etudiants != null) {
            this.etudiants.forEach(i -> i.setNiveau(null));
        }
        if (etudiants != null) {
            etudiants.forEach(i -> i.setNiveau(this));
        }
        this.etudiants = etudiants;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public Niveau matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Niveau addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        matiere.setNiveau(this);
        return this;
    }

    public Niveau removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        matiere.setNiveau(null);
        return this;
    }

    public void setMatieres(Set<Matiere> matieres) {
        if (this.matieres != null) {
            this.matieres.forEach(i -> i.setNiveau(null));
        }
        if (matieres != null) {
            matieres.forEach(i -> i.setNiveau(this));
        }
        this.matieres = matieres;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Niveau)) {
            return false;
        }
        return id != null && id.equals(((Niveau) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Niveau{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}

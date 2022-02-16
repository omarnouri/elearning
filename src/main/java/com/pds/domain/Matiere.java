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
 * A Matiere.
 */
@Entity
@Table(name = "matiere")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Matiere implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "matiere")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "matiere" }, allowSetters = true)
    private Set<Cours> cours = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "matieres" }, allowSetters = true)
    private Formateur formateur;

    @ManyToOne
    @JsonIgnoreProperties(value = { "etudiants", "matieres" }, allowSetters = true)
    private Niveau niveau;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Matiere id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Matiere nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Matiere description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Cours> getCours() {
        return this.cours;
    }

    public Matiere cours(Set<Cours> cours) {
        this.setCours(cours);
        return this;
    }

    public Matiere addCours(Cours cours) {
        this.cours.add(cours);
        cours.setMatiere(this);
        return this;
    }

    public Matiere removeCours(Cours cours) {
        this.cours.remove(cours);
        cours.setMatiere(null);
        return this;
    }

    public void setCours(Set<Cours> cours) {
        if (this.cours != null) {
            this.cours.forEach(i -> i.setMatiere(null));
        }
        if (cours != null) {
            cours.forEach(i -> i.setMatiere(this));
        }
        this.cours = cours;
    }

    public Formateur getFormateur() {
        return this.formateur;
    }

    public Matiere formateur(Formateur formateur) {
        this.setFormateur(formateur);
        return this;
    }

    public void setFormateur(Formateur formateur) {
        this.formateur = formateur;
    }

    public Niveau getNiveau() {
        return this.niveau;
    }

    public Matiere niveau(Niveau niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Niveau niveau) {
        this.niveau = niveau;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Matiere)) {
            return false;
        }
        return id != null && id.equals(((Matiere) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matiere{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}

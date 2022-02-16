package com.pds.repository;

import com.pds.domain.Ficher;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ficher entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FicherRepository extends JpaRepository<Ficher, Long> {}

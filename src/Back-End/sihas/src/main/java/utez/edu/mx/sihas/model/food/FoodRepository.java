package utez.edu.mx.sihas.model.food;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query("""
        SELECT a FROM alimento a
        JOIN a.relacionesConHorario r
        JOIN r.horario h
        WHERE h.usuario.id = :idUsuario
    """)
    List<Food> findAlimentosPorUsuario(@Param("idUsuario") Long idUsuario);

}
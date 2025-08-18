package utez.edu.mx.sihas.model.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSimpleDto {

    private Long id_user;

    public UserSimpleDto(Long idUser) {
        this.id_user = idUser;
    }
}

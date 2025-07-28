package utez.edu.mx.sihas.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sihas.model.rol.Rol;
import utez.edu.mx.sihas.model.rol.RolRepository;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserDto;
import utez.edu.mx.sihas.model.user.UserRepository;
import utez.edu.mx.sihas.utils.Message;
import utez.edu.mx.sihas.utils.TypesResponse;

import java.sql.SQLException;
import java.util.Optional;
import java.util.Set;

@Transactional
@Service
public class UserService {
    private final UserRepository userRepository;
    private final RolRepository rolRepository;

    @Autowired
    public UserService(UserRepository userRepository, RolRepository rolRepository) {
        this.userRepository = userRepository;
        this.rolRepository = rolRepository;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> save(UserDto user) {
        if (user.getName().length() > 30) {
            return new ResponseEntity<>(new Message("El nombre excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getSurname().length() > 30) {
            return new ResponseEntity<>(new Message("El apellido paterno excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getLastname().length() > 30) {
            return new ResponseEntity<>(new Message("El apellido materno el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getEmail().length() > 30) {
            return new ResponseEntity<>(new Message("El nombre excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getRoles().isEmpty()) {
            return new ResponseEntity<>(new Message("El rol debe ser necesario", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        Rol rol = rolRepository.findByName(user.getRoles().get(0).getName()).orElseThrow(
                () -> new RuntimeException("Rol no encontrado"));


        User saveUser = new User(user.getName(), user.getSurname(), user.getLastname(), user.getEmail()
                , user.getPassword(), false);

        saveUser.setRoles((Set<Rol>) rol);
        saveUser = userRepository.saveAndFlush(saveUser);
        if (saveUser == null) {
            return new ResponseEntity<>(new Message("El usuario no se pudo ingresar", TypesResponse.ERROR), HttpStatus.BAD_REQUEST);

        }

        return new ResponseEntity<>(new Message(saveUser, "El usuario se registro correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByID(Long  id) {
        Optional<User> userList = userRepository.findById(id);
        return new ResponseEntity<>(new Message(userList,"Listado de usuario", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> update(UserDto user) {
        Optional<User> userOptional = userRepository.findById(user.getId_user());
        if(!userOptional.isPresent()){
            return new ResponseEntity<>(new Message("El user no existe",TypesResponse.ERROR),HttpStatus.NOT_FOUND);
        }

        if (user.getName().length() > 30) {
            return new ResponseEntity<>(new Message("El nombre excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getSurname().length() > 30) {
            return new ResponseEntity<>(new Message("El apellido paterno excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getLastname().length() > 30) {
            return new ResponseEntity<>(new Message("El apellido materno el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
        if (user.getEmail().length() > 30) {
            return new ResponseEntity<>(new Message("El nombre excede el número de caracteres", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        User userUpdate = userOptional.get();
        userUpdate.setName(user.getName());
        userUpdate.setSurname(user.getSurname());
        userUpdate.setLastname(user.getLastname());
        userUpdate.setEmail(user.getEmail());


        userUpdate = userRepository.saveAndFlush(userUpdate);

        if(userUpdate == null){
            return new ResponseEntity<>(new Message("El usuario no se actualizó",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new Message(userUpdate,"El usuario se actualizó correctamente",TypesResponse.SUCCESS),HttpStatus.OK);
    }


    public ResponseEntity<Message> updateStatus(Long id, Boolean status) {
        Optional<User> userOptional = userRepository.findById(id);

        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(new Message("Usuario no encontrado",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }
        if (status == null) {
            return new ResponseEntity<>(new Message("El estatus es obligatorio",TypesResponse.ERROR),HttpStatus.BAD_REQUEST);
        }

        User userUpdate = userOptional.get();
        userUpdate.setStatus(status);
        userRepository.saveAndFlush(userUpdate);

        return new ResponseEntity<>(new Message("Se ha atualizado", TypesResponse.SUCCESS), HttpStatus.OK);

    }


}

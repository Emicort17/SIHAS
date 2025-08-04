package utez.edu.mx.sihas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SihasApplication {

	public static void main(String[] args) {
		SpringApplication.run(SihasApplication.class, args);
	}

}

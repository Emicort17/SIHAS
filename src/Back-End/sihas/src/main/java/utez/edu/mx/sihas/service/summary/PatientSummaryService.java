package utez.edu.mx.sihas.service.summary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.sihas.controller.summary.NutritionSummaryDto;
import utez.edu.mx.sihas.controller.summary.dto.PatientSummaryDto;
import utez.edu.mx.sihas.model.exercise.ExerciseRepository;
import utez.edu.mx.sihas.model.food_food_schedule.FoodFoodScheduleRepository;
import utez.edu.mx.sihas.model.sleep.SleepRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PatientSummaryService {

    @Autowired
    private FoodFoodScheduleRepository foodFoodScheduleRepository;

    @Autowired
    private SleepRepository sleepRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    public PatientSummaryDto getSummaryForUser(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);

        NutritionSummaryDto nutrition = foodFoodScheduleRepository.getNutritionSummaryForUser(userId, weekAgo);
        if (nutrition == null) nutrition = new NutritionSummaryDto(0.0, 0.0, 0.0, 0.0, 0.0);

        List<Double> sleepHours = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = weekAgo.plusDays(i);
            Double hours = sleepRepository.getTotalSleepHoursForDay(userId, day);
            sleepHours.add(hours != null ? hours : 0.0);
        }

        Integer currentExerciseCount = exerciseRepository.countExercisesForUserSince(userId, weekAgo);

        int exerciseGoal = 5;

        return new PatientSummaryDto(
                nutrition.getKcal(),
                nutrition.getProtein(),
                nutrition.getCarbs(),
                nutrition.getFat(),
                nutrition.getFiber(),
                sleepHours,
                currentExerciseCount,
                exerciseGoal
        );
    }

}

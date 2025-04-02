package tn.esprit.spring.services;
import org.springframework.scheduling.annotation.Scheduled;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.spring.entities.Course;
import tn.esprit.spring.repositories.ICourseRepository;
import tn.esprit.spring.services.ICourseServices;
import java.util.List;


@Slf4j
@Service
@AllArgsConstructor
public class CourseServicesImpl implements ICourseServices {
    private final ICourseRepository courseRepository;

    @Override
    public List<Course> retrieveAllCourses() {
        log.info("Récupération de tous les cours...");
        List<Course> courses = courseRepository.findAll();
        log.debug("Nombre de cours récupérés : {}", courses.size());
        return courses;
    }

    @Override
    public Course addCourse(Course course) {
        log.info("Ajout d'un nouveau cours : {}", course);
        Course savedCourse = courseRepository.save(course);
        log.debug("Cours ajouté avec ID : {}", savedCourse.getNumCourse());
        return savedCourse;
    }

    @Override
    public Course updateCourse(Course course) {
        if (course == null) {
            log.warn("Tentative de mise à jour d'un cours NULL !");
            return null;
        }
        log.info("Mise à jour du cours avec ID : {}", course.getNumCourse());
        Course updatedCourse = courseRepository.save(course);
        log.debug("Cours mis à jour avec succès : {}", updatedCourse);
        return updatedCourse;
    }

    @Override
    public Course retrieveCourse(Long numCourse) {
        log.info("Récupération du cours avec ID : {}", numCourse);
        return courseRepository.findById(numCourse).orElseThrow(() -> {
            log.error("Cours avec ID {} non trouvé", numCourse);
            return new RuntimeException("Cours introuvable !");
        });
    }
}

import pytest
from calculator import Course

def make_course(name):
    test_assessments = [
        ("Pset 1", {"name": "Pset 1", "category": "Problem Sets", "earned": 95.5, "possible": 100}),
        ("Pset 2", {"name": "Pset 2", "category": "Problem Sets", "earned": 97.5, "possible": 100}),
        ("Pset 3", {"name": "Pset 3", "category": "Problem Sets", "earned": 90.0, "possible": 100}),
        ("Pset 4", {"name": "Pset 4", "category": "Problem Sets", "earned": 100.0, "possible": 100}),
        ("Pset 5", {"name": "Pset 5", "category": "Problem Sets", "earned": 92.5, "possible": 100}),
        ("Pset 6", {"name": "Pset 6", "category": "Problem Sets", "earned": 99.0, "possible": 100}),
        ("Pset 7", {"name": "Pset 7", "category": "Problem Sets", "earned": 99.5, "possible": 100}),
        ("Pset 8", {"name": "Pset 8", "category": "Problem Sets", "earned": 93.0, "possible": 100}),
        ("Pset 9", {"name": "Pset 9", "category": "Problem Sets", "earned": 98.5, "possible": 100}),
        ("Midterm1", {"name": "Midterm1", "category": "Midterm I", "earned": 96.5, "possible": 100}),
        ("Midterm2", {"name": "Midterm2", "category": "Midterm II", "earned": 99, "possible": 100}),
        ("Quiz1", {"name": "Quiz1", "category": "Quizzes", "earned": 8, "possible": 10}),
        ("Quiz2", {"name": "Quiz2", "category": "Quizzes", "earned": 9, "possible": 10}),
        ("Quiz3", {"name": "Quiz3", "category": "Quizzes", "earned": 7, "possible": 10}),
        ("Quiz4", {"name": "Quiz4", "category": "Quizzes", "earned": 10, "possible": 10}),
        ("Quiz5", {"name": "Quiz5", "category": "Quizzes", "earned": 8, "possible": 10}),
        ("Quiz6", {"name": "Quiz6", "category": "Quizzes", "earned": 6, "possible": 10}),
    ]
    test_weights = {"Problem Sets": 0.2, "Midterm I": 0.15, "Midterm II": 0.15, "Quizzes": 0.1}
    return Course(name, test_weights, test_assessments)

def test_category_percentage():
    c = make_course("MATH 206")
    assert c.category_percentage("Problem Sets") == pytest.approx(96.17, abs=0.01)

def test_total_grade():
    c = make_course("MATH 206")
    assert c.total_grade() == pytest.approx(94.26,abs=0.01)

def test_add_and_del_category():
    c = make_course("MATH 206")
    c.add_category("Final", 0.4)
    assert "Final" in c.weights
    assert c.weights["Final"] == 0.4
    c.add_assessment ("Final Exam", "Final", 97, 100)
    assert c.category_percentage("Final") == pytest.approx(97.0, abs=0.01)
    assert c.total_grade() == pytest.approx(95.36, abs=0.01)
    c.del_category("Final")
    assert "Final" not in c.weights
    assert c.total_grade() == pytest.approx(94.26, abs=0.01)
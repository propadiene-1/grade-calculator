import numpy as np

#3 x n: weight, points earned, total points

class Course ():
    def __init__ (self, name, weights, assessments):
        self.name = name
        self.weights = weights
        self.assessments = assessments
    
    def add_grade(self, name, category, earned, possible):
        self.assessments.append({"name": name, "category": category, "earned": earned, "possible": possible})
        return 
    
    def category_percentage(self, category):
        total_earned = 0
        total_possible = 0
        for assessment in self.assessments:
            if assessment["category"] == category:
                total_earned += assessment["earned"]
                total_possible += assessment["possible"]
        return round((total_earned / total_possible) * 100, 2)
    
    def total_grade(self):
        total = 0
        for i in weights.keys():
            total += self.category_percentage(i)*weights[i]
        return total

assessments = [
    {"name": "HW1", "category": "HW", "earned": 95, "possible": 100},
    {"name": "Midterm1", "category" : "Midterms", "earned" : 95, "possible" : 100}
]
weights = {"HW": 0.4, "Midterms":0.6}
name = "MATH 305"

course = Course(name, weights, assessments)

print(course.category_percentage("Midterms"))
print(course.total_grade())
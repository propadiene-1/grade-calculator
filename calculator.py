class Course ():
    def __init__ (self, name, weights, assessments):
        self.name = name
        self.weights = weights
        self.assessments = assessments
    
    def add_grade(self, name, category, earned, possible):
        self.assessments.append({"name": name, "category": category, "earned": float(earned), "possible": float(possible)})
        return 
    
    def add_category(self, category, weight):
        self.weights[category] = float(weight)

    def del_category(self, category):
        if category in self.weights.keys():
            del self.weights[category]

    def category_percentage(self, category):
        total_earned = 0
        total_possible = 0
        for assessment in self.assessments:
            if assessment["category"] == category:
                total_earned += assessment["earned"]
                total_possible += assessment["possible"]
        if total_possible == 0:
            return None
        return round((total_earned / total_possible) * 100, 2)
    
    def total_grade(self):
        total_weight = 0.0
        total_earned = 0.0

        for cat, w in self.weights.items():
            pct = self.category_percentage(cat)
            if pct is None:
                pct = 0.0
                w = 0.0
            total_earned += pct*w
            total_weight += w
    
        if total_weight == 0:
            return None

        return round((total_earned / total_weight), 2)
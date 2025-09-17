// course.js
export class Course {
  constructor(name, weights = {}, assessments = []) {
    this.name = name;
    this.weights = weights;        // { category: weight }
    this.assessments = assessments; // [ [name, {name, category, earned, possible}] ]
  }

  addAssessment(name, category, earned, possible) {
    this.assessments.push([
      name,
      { name, category, earned: Number(earned), possible: Number(possible) }
    ]);
  }

  addCategory(category, weight) {
    this.weights[category] = Number(weight);
  }

  delCategory(category) {
    if (category in this.weights) delete this.weights[category];
  }

  categoryPercentage(category) {
    let totalEarned = 0, totalPossible = 0;
    for (const a of this.assessments) {
      if (a[1].category === category) {
        totalEarned += a[1].earned;
        totalPossible += a[1].possible;
      }
    }
    if (totalPossible === 0) return null;
    return Math.round((totalEarned / totalPossible) * 10000) / 100; // 2dp
  }

  totalGrade() {
    let total = 0, wsum = 0;
    for (const [cat, w] of Object.entries(this.weights)) {
      const pct = this.categoryPercentage(cat);
      if (pct == null) continue; // skip empty categories (matches your Python behavior)
      total += pct * w;
      wsum += w;
    }
    if (wsum === 0) return null;
    return Math.round((total / wsum) * 100) / 100;
  }
}
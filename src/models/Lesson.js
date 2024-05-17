class Lesson{
    constructor(id, title, description, teacher, create_at){
        this.id = id;
        this.title = title;
        this.teacher = teacher;
        this.description = description;
        this.thumbnail = thumbnail;
        this.create_at = create_at;

        // Rating
        this.total_rate = 0;
        this.number_of_rates = 0;
        this.rating = 0;
    }

    updateRating(rate){
        this.total_rate += rate;
        this.number_of_rates += 1;
        this.rating = this.total_rate / this.number_of_rates;
    }
}
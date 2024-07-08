const dateToInputValue = (date) => {
    return date.toISOString().split('T')[0];
}
export var date_to_characters = (datesec) => {
    var date_obj = new Date() - new Date(datesec);

    if (Math.floor(date_obj / 1000) === 0) {
        return "сейчас.";
    } else if (Math.floor(date_obj / 1000) === 1) {
        return "одну секунду назат";
    } else if (date_obj / 1000 < 60) {
        return Math.floor(date_obj / 1000) + "  секунд(ы) назат";
    } else if (Math.floor(date_obj / (1000 * 60)) === 1) {
        return "одну минут назат";
    } else if (date_obj / (1000 * 60) < 60) {
        return Math.floor(date_obj / (1000 * 60)) + " минут(ы) назат";
    } else if (Math.floor(date_obj / (1000 * 3600)) === 1) {
        return "один час назат";
    } else if (date_obj / (1000 * 3600) < 24) {
        return Math.floor(date_obj / (1000 * 3600)) + " часа(ов) назат";
    } else if (Math.floor(date_obj / (1000 * 3600 * 24)) === 1) {
        return "один день назат";
    } else if (Math.floor(date_obj / (1000 * 3600 * 24 * 30)) < 1) {
        return Math.floor(date_obj / (1000 * 3600 * 24)) + " дня(ей) назат";
    } else {
        return (
            Math.floor(date_obj / (1000 * 3600 * 24 * 30)) + " месяц(ов) назат"
        );
    }
}
function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
}
export function formatDate(date) {
 
    var date_obj = new Date() - date;
    var long_time = [];
    const days = Math.floor(date_obj / (1000 * 3600 * 24)) ; 
    if ( days >= 1 || days <= -1) {
        long_time = [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join(".");
    }


    return (

        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
        ].join(":") + " " +
        long_time

    );
}
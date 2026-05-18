export const getBgColor = () => {

    const bgarr = ["#b73e3e", "#5b45b0", "7f167f", "#735f32", "#1d2569", "#285430", "bg-yellow-500",
        "bg-green-600",
        "bg-blue-600",
        "bg-purple-600",
        "bg-pink-600"]
    const randomBg = Math.floor(Math.random() * bgarr.length);
    const color = bgarr[randomBg];
    return color;
}

export const getAvatarName = (name) => {
    if (!name) return "";
    return name.split(" ").map(word => word[0]).join("").toUpperCase()
}


export const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
};


export const formatDateAndTime = (data) => {
    const dateAndTime = new Date(data).toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    })

    return dateAndTime

}

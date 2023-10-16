(async function(){
    try {
        const response = await axios.get("/staff");
        const data = response.data[0];
        console.log(data);
        console.log($("#quiz-list"));
    } catch (error) {
        console.log(error);
    }
})();
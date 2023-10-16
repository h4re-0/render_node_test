async function quizAll(eQuizList) {
    try {
        const response = await axios.get("/quiz_all");
        const data = response.data;
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            let eQuiz = $(`
            <tr class="quiz">
            <td class="content">${data[i].content}</td>
            <td class="answer">${data[i].answer}</td>
            <td class="comment">${data[i].comment.split('\\n').join("<br>")}</td>
            </tr>`);
            eQuizList.append(eQuiz);
        }
    } catch (error) {
        console.log(error);
    }
}
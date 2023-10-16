async function quizAll() {
    const eQuizList = $('#quiz-list');
    eQuizList.empty();

    let eHead = $(`
    <tr class="quiz">
        <th class="content">問題</th>
        <th class="answer">答え</th>
        <th class="comment">解説</th>
        <th class="deletebutton"></th>
        <th class="updatebutton"></th>
    </tr>`);
    eQuizList.append(eHead);

    const eQuizLoading = $('#quiz-loading');
    eQuizLoading.append($('<span>now loading</span>'));

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
            <td class="deletebutton"><button onClick="deleteQuiz(${data[i].id})">削除</button></td>
            <td class="updatebutton"><button><a href="${makeUpdateQuizURL(data[i])}">変更</a></button></td>
            </tr>`);
            eQuizList.append(eQuiz);
        }

        eQuizLoading.empty();
    } catch (error) {
        console.log(error);
    }
}

async function deleteQuiz(quizId) {
    console.log(quizId);

    const response = await axios.delete("/delete_quiz", {
        data: {
            id: quizId
        }
    });

    quizAll();
}

function makeUpdateQuizURL(quizDatum) {
    const id = quizDatum.id;
    const content = encodeURIComponent(quizDatum.content);
    const answer = encodeURIComponent(quizDatum.answer);
    const comment = encodeURIComponent(quizDatum.comment);

    console.log(encodeURIComponent(quizDatum.content));

    const url = `updatequiz.html?id=${id}&content=${content}&answer=${answer}&comment=${comment}`;

    return url;
}

$(document).ready(function () {
    quizAll();
});
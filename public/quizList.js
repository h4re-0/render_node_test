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
            <td class="content">${sanitize(data[i].content).split('\n').join("<br>")}</td>
            <td class="answer">${sanitize(data[i].answer)}</td>
            <td class="comment">${sanitize(data[i].comment).split('\n').join("<br>")}</td>
            <td class="deletebutton"><button onClick="deleteQuiz(${data[i].id})">削除</button></td>
            <td class="updatebutton"><button onClick="openUpdateQuiz(${data[i].id})">変更</a></button></td>
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

function openUpdateQuiz(quizId){
    const url = `updatequiz.html?id=${quizId}`;
    
    window.location.href = url;
}

$(document).ready(function () {
    quizAll();
});
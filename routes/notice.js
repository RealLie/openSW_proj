module.exports = (router, Users, Notices, randomString) => {
	// 글 작성
	router.post('/add', async (req, res) => {
		let new_notice = new Notices({
			writer: req.body.token,
			title: req.body.title,
			content: req.body.content,
			noticeToken: randomString.generate(12), // 랜덤한 문자열 12자리 생성
		});

		try {
			await new_notice.save();
			return res.status(200).json({ data: new_notice });
		} catch (e) {
			return res.status(500).json({ message: 'add Fail' });
		}
	});

	// 글 리스트 불러오기
	router.get('/getList', async (req, res) => {
		let list = await Notices.find(); // 전체 리스트 불러오기.
		return res.status(200).json({ data: list });
	});

	// 글 불러오기
	router.get('/get/:noticeToken', async (req, res) => {
		let notice = await Notices.findOne({ noticeToken: req.params.noticeToken });
		if (notice) {
			let user = await Users.findOne({ token: notice.writer }); // 작성자 이름을 얻기 위해, 토큰으로 검색
			return res.status(200).json({ data: { ...notice._doc, writerName: user.name } });
		}
		return res.status(500).json({ message: 'Notice Not Found' });
	});

	// 글 삭제
	router.post('/del', async (req, res) => {
		let result = await Notices.deleteOne({ noticeToken: req.body.noticeToken, writer: req.body.token });
		if (result.ok) return res.status(200).json({ message: 'success!' });
		else return res.status(500).json({ message: 'Delete Fail!' });
	});

	// 글 수정
	router.post('/modify', async (req, res) => {
		let result = await Notices.updateOne(
			{
				noticeToken: req.body.noticeToken,
				writer: req.body.token,
			},
			{ $set: { content: req.body.content } }
		);
		if (result.ok) return res.status(200).json({ message: 'success!' });
		else return res.status(500).json({ message: 'Delete Fail!' });
	});
	return router;
};
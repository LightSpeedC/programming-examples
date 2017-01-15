const WAREKI_LIST = [
	{from: new Date('2019-01-01'), gengo: '新元号'},
	{from: new Date('1989-01-08'), gengo: '平成'},
	{from: new Date('1926-12-25'), gengo: '昭和'},
	{from: new Date('1912-07-30'), gengo: '大正'},
	{from: new Date('1868-01-25'), gengo: '明治'},
];
function toWareki(date) {
	let year = date.getFullYear(), str = year;
	WAREKI_LIST.some(wareki => date >= wareki.from &&
			(str = wareki.gengo +
				(year === wareki.from.getFullYear() ? '元' :
				year - wareki.from.getFullYear() + 1)));
	return str;
}

const DAY_OF_WEEKS = ['日', '月', '火', '水', '木', '金', '土'];

// カレンダー
const Calendar = props => {
	const year = props.year || (new Date().getFullYear());
	const month = props.month || (new Date().getMonth() + 1);
	const start_dt = new Date(year, month - 1, 1);
	start_dt.setDate(start_dt.getDate() - start_dt.getDay() - 1);
	const end_dt = new Date(year, month, 0);
	end_dt.setDate(end_dt.getDate() - end_dt.getDay() + 6);
	const numOfWeeks = (end_dt - start_dt) / (24 * 3600 * 1000) / 7;

	return <table>
		<caption>{toWareki(new Date(year, month - 1, 1)) + '/' +
			year + '年' + month + '月'}</caption>
		<thead>
			<tr>{DAY_OF_WEEKS.map(dayOfWeek => <th>{dayOfWeek}</th>)}</tr>
		</thead>
		<tbody>
			{range(numOfWeeks).map(() => <tr>
				{range(7).map(() => <td>
					{(start_dt.setDate(start_dt.getDate() + 1),
					(start_dt.getMonth() === month - 1 ?
						start_dt.getDate() : null))}
				</td>)}
			</tr>)}
		</tbody>
	</table>;
};

ReactDOM.render(<Calendar year={2016} month={12} />, $calendar1);
ReactDOM.render(<Calendar year={2017} month={1} />, $calendar2);
ReactDOM.render(<Calendar year={2017} month={2} />, $calendar3);

// range([from], to)
function range(from, to) {
	if (arguments.length === 1) to = from, from = 0;
	const arr = [];
	for (let i = from; i < to; ++i)
		arr.push(i);
	return arr;
}

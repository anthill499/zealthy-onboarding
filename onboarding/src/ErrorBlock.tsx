import './index.css'
function ErrorBlock(errorList: string[]) {
    if (errorList.length === 0) {
        return
    }

	return (
		<div className='form-errors'>
			<ul>
				{errorList.map((errString: string, idx) => (
					<li key={idx}>{errString}</li>
				))}
			</ul>
		</div>
	);
}

export default ErrorBlock
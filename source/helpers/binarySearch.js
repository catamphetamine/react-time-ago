// "Binary" search in a sorted array.
export default function (array, test) {
	if (array.length === 0) {
		return 0
	}

	let min = 0
	let max = array.length - 1
	let guess

	while (min <= max) {
		guess = Math.floor((max + min) / 2)

		const result = test(array[guess])
		if (result === 0) {
			return guess
		}
		else if (result < 0) {
			min = guess + 1
			if (min > max) {
				return min
			}
		}
		else {
			max = guess - 1
			if (max < min) {
				return min
			}
		}
	}

	// return -1
	// return min
}
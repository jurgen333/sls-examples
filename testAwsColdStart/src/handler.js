let coldStart = true
module.exports.hello = async (event) => {
    if (coldStart === true) {
        coldStart = false
        console.log('Cold Start')
        return 1
    }
    console.log('Warm start')
    return 0
}

const signUp = (data) => {
    return $.ajax({
        url: '/api/v1/admin/signup',
        type: 'post',
        data,
        success: (results) => {
            return results
        }
    })
}



const signIn = (data) => {
    return $.ajax({
        url: '/api/v1/admin/signin',
        type: 'post',
        data,
        success: (results) => {
            return results
        }
    })
}
export default{
    signUp,
    signIn
}
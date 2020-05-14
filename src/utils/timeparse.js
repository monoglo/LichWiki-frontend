export function timeParse(my_date_time) {
    var date_time_split = my_date_time.split('T')
    var date = date_time_split['0']
    var time = date_time_split['1'].split('.')['0']
    var Y = date.split('-')['0']
    var M = date.split('-')['1']
    var D = date.split('-')['2']
    return Y + "年" + M + "月" + D + "日" + " " + time
}
const connection = require('./connection');

async function getAllReservations(parameters = {}) {
    let selectSql = `SELECT  
                            b.is_bsu,
                            b.proof_bsu,
                            CONCAT(r.first_name, ' ', r.last_name) AS fullName,
                            r.number_lanes,
                            DATE_FORMAT(r.date, "%d-%m-%Y") AS formatted_date,
                            TIME_FORMAT(r.start_time, "%h:%i %p") AS formatted_start_time, 
                            TIME_FORMAT(r.end_time, "%h:%i %p") AS formatted_end_time,
                            r.extra_info,
                            r.is_paid,
                            r.id
                        FROM reservation_info r
                        INNER JOIN bsu_info b ON r.bsu_id = b.id`,
        whereStatements = [],
        orderByStatements = [],
        queryParameters = [];

    if (typeof parameters.visitors !== 'undefined' && parseInt(parameters.visitors) === 0) {
        whereStatements.push("b.is_bsu != '1'");
    }

    if (typeof parameters.stuFac !== 'undefined' && parseInt(parameters.stuFac) === 0) {
        whereStatements.push("b.is_bsu != '0'");
    }

    if (typeof parameters.searchName !== 'undefined' && parameters.searchName.length > 0) {
        const searchedFullName = parameters.searchName;
        whereStatements.push("CONCAT(r.first_name, ' ', r.last_name) LIKE ?");
        queryParameters.push('%' + searchedFullName + '%');
    }

    if (typeof parameters.sort !== 'undefined') {
        const sort = parameters.sort;
        if (sort === 'ASC') {
            orderByStatements.push('r.date ASC');
        } else if (sort === 'DESC') {
            orderByStatements.push('r.date DESC')
        }
    }

    //Dynamically add WHERE expressions to SELECT statements if needed
    if (whereStatements.length > 0) {
        selectSql = selectSql + ' WHERE ' + whereStatements.join(' AND ');
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (orderByStatements.length > 0) {
        selectSql = selectSql + ' ORDER BY ' + orderByStatements.join(', ');
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (typeof parameters.limit !== 'undefined' && parameters.limit > 0 && parameters.limit < 6) {
        selectSql = selectSql + ' LIMIT ' + parameters.limit;
    }
    return await connection.query(selectSql, queryParameters);
}

async function getPrevResponse(id) { //rename to getById ?
    const selectSql = 'SELECT r.first_name, r.last_name, r.number_lanes, DATE_FORMAT(r.date, "%Y-%m-%d") AS formatted_date, DATE_FORMAT(r.start_time, "%H:%i") AS formatted_start_time, DATE_FORMAT(r.end_time, "%H:%i") AS formatted_end_time, b.is_bsu, b.proof_bsu, r.extra_info, r.is_paid, r.id FROM reservation_info r INNER JOIN bsu_info b ON r.bsu_id = b.id WHERE r.id = ?;'

    let queryParameters = [id];
    return await connection.query(selectSql, queryParameters);
}

async function insert(parameters = {}, file) {
    const insertSql = 'INSERT INTO bsu_info (is_bsu, proof_bsu) VALUES (?, ?);'
    let bsuQueryParameters = [
        parameters.isBSU,
        file.idPhoto && file.idPhoto[0].path || null
    ];
    console.log(bsuQueryParameters);
    let firstResults = await connection.query(insertSql, bsuQueryParameters);
    console.log(firstResults);
    const secondInsertSql = 'INSERT INTO reservation_info (bsu_id, first_name, last_name, number_lanes, date, start_time, end_time, extra_info, is_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
    let reservationQueryParameters = [
        firstResults.insertId, //maybe firstResults.id instead? reservationQueryParameters at leat goes through but this goes through undefined that way tho
        parameters.inputFirstName,
        parameters.inputLastName,
        parameters.numLanes,
        parameters.inputDate,
        parameters.inputStartTime,
        parameters.inputEndTime,
        parameters.inputMisc,
        parameters.isPaying
    ];
    console.log(reservationQueryParameters);
    await connection.query(secondInsertSql, reservationQueryParameters);
}

//functions for PA9:
async function update(id, parameters = {}, file) {
    const resUpdateSql = 'UPDATE reservation_info r INNER JOIN bsu_info b ON r.bsu_id = b.id SET r.first_name = ?, r.last_name = ?, r.number_lanes = ?, r.date = ?, r.start_time = ?, r.end_time = ?, r.extra_info = ?, r.is_paid = ?, b.is_bsu = ?, b.proof_bsu = ? WHERE r.id = ?;'
    let reservationQueryParameters = [
        parameters.inputFirstName,
        parameters.inputLastName,
        parameters.numLanes,
        parameters.inputDate,
        parameters.inputStartTime,
        parameters.inputEndTime,
        parameters.inputMisc,
        parameters.isPaying,
        parameters.isBSU,
        file.idPhoto && file.idPhoto[0].path || null,
        id
    ];
    console.log(reservationQueryParameters);
    await connection.query(resUpdateSql, reservationQueryParameters);
}
async function deleteReservation(id) {
    let idParameter = [id];
    //console.log('The universe is singing to me ALOT!!!');
    const deleteSql = `DELETE r, b
                            FROM reservation_info r 
                            INNER JOIN bsu_info b ON r.bsu_id = b.id                         
                            WHERE r.id = ?`;
    await connection.query(deleteSql, idParameter);
}

module.exports = {
    getAllReservations,
    getPrevResponse,
    insert,
    update,
    deleteReservation
}
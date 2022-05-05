/*
 * Write an SQL query in <pre><code class="sql" data-trim contenteditable>...</pre>
 * and create a <span class="sqlresult"></span> on the same slide.
 * The result of the query is displayed as a table in the sqlresult span.
 * Add data-sql="some_id" to the <code> element and the result will be
 * displayed in the <span id="some_id">. 
 * 
 * The query can be modified during the presentation. 
 * Press Ctrl+Enter to re-execute it.
 * 
 * Alternatively, a table can just show the result of an SQL query:
 * <span data-sql-query="SELECT ..."/>
 * Here, data-sql-pk can be a comma-separated list
 * of primary-key columns which will be underlined.
 * 
 *
 * By Johannes Schildgen, 2019
 */
 
var SQLPlugin = (function(){
    
    if( window.Reveal ) Reveal.registerKeyboardShortcut( 'CTRL + Enter', 'Execute SQL Query' );

	return {
		init: function() {        
            db = create_db();
            document.querySelectorAll('.sql,.hlsql').forEach(function(item) {
                if(get_result_element(item) == null
                   || item.classList.contains('dont_execute_sql')) { return; }
                execute_query(item.innerText, get_result_element(item));
                item.addEventListener('keydown', function (e) {
                    if (e.ctrlKey && e.keyCode==13) { // 13 is enter
                      execute_query(item.innerText, get_result_element(this));
                }});
            });

            document.querySelectorAll('[data-sql-query]').forEach(function(item) {
                var pk = item.getAttribute('data-sql-pk') != undefined ? item.getAttribute('data-sql-pk').split(',').map(function(e) { return e.trim() }) : [];
                var tablename = item.getAttribute('data-sql-tablename') != undefined ? item.getAttribute('data-sql-tablename') : null;
                execute_query(item.getAttribute('data-sql-query'), item, pk, tablename);
            });
		}
	}

})();

Reveal.registerPlugin( 'sql', SQLPlugin );


/** input:  <code> element with class hlsql 
                output: corresponding <span> element with class sqlresult
                        If data-sql="an_id" is present in the <code> element, this one is taken,
                        otherwise the first element with class sqlresult on the same slide.
**/
function get_result_element(item) {
    if(item.attributes['data-sql'] != undefined) {
        result_element_id = item.attributes['data-sql'].value;
        return document.querySelector('#'+result_element_id);
    } else {
        return item.parentNode.parentNode.querySelector('.sqlresult');
    }
}


function errorFunction(tx, e) {
  alert(e.message);
}

function create_db() {
    
    db = openDatabase("DWH", "1", "DWH", 5*1024*1024);
    
    db.transaction(function(tx) {
        query = function(sql) { 
            onError = function(tx, e) {
                alert(e.message+"\n"+sql);
            }
            tx.executeSql(sql, [], null, onError); 
        }
        query("DROP TABLE IF EXISTS dim_date");
        query("CREATE TABLE dim_date (date_id INTEGER PRIMARY KEY AUTOINCREMENT, d_date date, d_year int, d_month int, d_week int, d_yearmonth char(7), holiday boolean)");
        query("INSERT INTO dim_date (d_date, holiday) VALUES('2022-01-01', true)");
        query("INSERT INTO dim_date (d_date, holiday) VALUES('2022-01-02', false)");
        query("INSERT INTO dim_date (d_date, holiday) VALUES('2022-01-03', false)");
        query("UPDATE dim_date SET d_year = strftime('%Y', d_date), d_month = strftime('%m', d_date), d_week = strftime('%W', d_date), d_yearmonth = strftime('%Y-%m', d_date)")

        query("DROP TABLE IF EXISTS bestellungen_positionen");
        query("DROP TABLE IF EXISTS bestellungen");
        query("DROP TABLE IF EXISTS bewertungslikes");
        query("DROP TABLE IF EXISTS bewertungen");
        query("DROP TABLE IF EXISTS products");
        query("DROP TABLE IF EXISTS manufacturers");
        query("DROP TABLE IF EXISTS customer");
        query("CREATE TABLE customer (customer_id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(500) UNIQUE, password land VARCHAR(100), referral_of INT REFERENCES customers(customer_id) ON DELETE SET NULL)");
        query("CREATE TABLE manufacturers (company VARCHAR(50) PRIMARY KEY, country VARCHAR(100))");
        query("CREATE TABLE products (product_id INT PRIMARY KEY, description VARCHAR(100) NOT NULL, price DECIMAL(9,2), manufacturer VARCHAR(50) REFERENCES manufacturers(company) ON UPDATE CASCADE, category VARCHAR(100))", [], null, errorFunction);
        /*query("CREATE TABLE bewertungen (kundennr INT REFERENCES kunden(kundennr), produktnr INT REFERENCES produkte(produktnr), sterne INT DEFAULT 5 CHECK(sterne BETWEEN 1 AND 5), bewertungstext VARCHAR(100000), PRIMARY KEY(kundennr, produktnr))");
        query("CREATE TABLE bewertungslikes (liker INT REFERENCES kunden(kundennr), kundennr INT REFERENCES kunden(kundennr), produktnr INT REFERENCES produkte(produktnr))");
        query("CREATE TABLE bestellungen (bestellnr INT PRIMARY KEY, kundennr INT REFERENCES kunden(kundennr), zeit TIMESTAMP, preis DECIMAL(9,2))");
        query("CREATE TABLE bestellungen_positionen (bestellnr INT REFERENCES bestellungen(bestellnr), produktnr INT REFERENCES produkte(produktnr), anzahl INT, PRIMARY KEY(bestellnr, produktnr))");
*/

        query("drop table if exists sales;")
        query("create table sales(sales_id, customer_id int, market_id int, product_id int references products(product_id), date_id int, amount int, revenue decimal(18,2))");
        query("insert into sales values(557, 5, 624, 17, 3, 1, 0.89)")

        /*query("INSERT INTO kunden VALUES(4,'Ute', 'ute@example.com', NULL, 'Deutschland', NULL)");                              
        query("INSERT INTO kunden VALUES(5,'Peter', 'peter@example.com', NULL, 'Deutschland', 4)");
        query("INSERT INTO kunden VALUES(8,'Anna', 'anna@example.com', 5, 'Italien', 5)"); */
        query("INSERT INTO manufacturers VALUES ('Calgonte', 'Italy')");
        query("INSERT INTO manufacturers VALUES ('Monsterfood', 'USA')");
        query("INSERT INTO manufacturers VALUES ('Woodfox', 'Austria')");
        query("INSERT INTO products VALUES(17, 'Chocolate Bar', 0.89, 'Monsterfood', 'Sweets')");
        query("INSERT INTO products VALUES(18, 'Müsliriegel', 1.19, 'Monsterfood', null)");
        query("INSERT INTO products VALUES(29, 'Spülmaschinentabs', 3.99, 'Calgonte', null)");
        query("INSERT INTO products VALUES(88, 'Katzenfutter', 4.99, NULL, null)");
        query("INSERT INTO products VALUES(91, 'Maschinenbau-Lehrbuch', 22.90, NULL, null)");
        query("INSERT INTO products VALUES(92, 'Regal', 100.00, NULL, null)");
        query("INSERT INTO products VALUES(998, 'Geschenkverpackung', 0.00, NULL, null)");
        query("INSERT INTO products VALUES(999, 'Katalog', 0.00, NULL, null)");
        /*query("INSERT INTO bewertungen VALUES(5, 17, 4, 'Guter Schokoriegel, aber die Verpackung geht schwer auf')");
        query("INSERT INTO bewertungen VALUES(5, 29, 1, 'Mein Geschirr wird nicht sauber!')");
        query("INSERT INTO bewertungen VALUES(8, 29, 2, 'Nicht gut, aber billig.')");
        query("INSERT INTO bewertungslikes VALUES(8,5,17)");
        query("INSERT INTO bestellungen VALUES(101, 5, '2018-05-26 20:31:00', 34.80)");
        query("INSERT INTO bestellungen VALUES(102, 8, '2018-05-26 20:31:01', 100)");
        query("INSERT INTO bestellungen VALUES(103, 8, '2018-05-27 8:15:00', 0.89)");
        query("INSERT INTO bestellungen_positionen VALUES(101, 91, 1)");
        query("INSERT INTO bestellungen_positionen VALUES(101, 18, 10)");
        query("INSERT INTO bestellungen_positionen VALUES(102, 91, 1)");
        query("INSERT INTO bestellungen_positionen VALUES(103, 17, 1)");*/
    });
    
    
    
    return db
}


function execute_query(query, res_element, pk=[], tablename = null) {
    db.transaction(function(tx) {
        tx.executeSql(query, [], function(tx, results) {
            if(results.rows.length == 0) { // empty result set
                res_element.innerHTML = '- empty result set -';
                return;
            }

            var header = results.rows.item(0);

            html = '<table style="font-size:0.7em"></tr><thead>';
            if(tablename != null) {
                html += '<tr><td colspan="'+Object.keys(header).length+'" align="center" style="border-bottom: none; padding-bottom:0px;">'+tablename+'</td></tr>';
            }
            html += '<tr>';

            //header
            for(var column in header) {
                if(pk.indexOf(column)>-1) { column = '<u>'+column+'</u>'; }
                html += '<th style="padding-top:0px;">'+column+'</th>';
            }

            html += '</tr><thead>';

            //data rows
            for(i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                html += '<tr>'

                for(var column in row) {
                    html += '<td>'+(row[column]!=null ? row[column] : '-') +'</td>';
                }

                html += '</tr>';
            }

            html += '</table>';

            res_element.innerHTML = html;
        }, errorFunction);
    });
}
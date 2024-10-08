<?php
header("Content-type: text/plain");

$engine = @$_REQUEST['engine'];

switch ($engine) {
	case "mysql":
		$dbh = new PDO("mysql:host=localhost;dbname=oth", "oth", "password");
		break;
	case "pgsql":
		$dbh = new PDO("pgsql:dbname=oth", "oth", "password");
		break;
	case "sqlite":
	default:
		$dbh = new PDO("sqlite:webshop.db");
		break;
}

if (!$dbh) {
	echo(json_encode(array("error" => $dbh->errorInfo()[2])));
	die();
}

try {
	$stm = $dbh->query($_REQUEST['stmt']);
} catch (Exception $e) {
	echo(json_encode(array("error" => $e->getMessage())));
	die();
}

if (!$stm) {
	echo(json_encode(array("error" => $dbh->errorInfo()[2])));
	die();
}

$res = $stm->fetchAll(PDO::FETCH_CLASS);

echo(json_encode(array("data" => $res)));

?>

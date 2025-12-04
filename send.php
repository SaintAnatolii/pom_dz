<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Включение отображения ошибок для отладки (удалить в продакшене)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Устанавливаем заголовок для JSON ответа
header('Content-Type: application/json; charset=utf-8');

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["result" => "error", "status" => "Метод не поддерживается"]);
    exit;
}

// Читаем JSON данные из тела запроса
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Проверяем, удалось ли декодировать JSON
if ($data === null) {
    echo json_encode([
        "result" => "error", 
        "status" => "Неверный формат данных (ожидается JSON)"
    ]);
    exit;
}

// Безопасное получение данных из JSON
$name = isset($data['firstname']) ? trim($data['firstname']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$teacher = isset($data['teacher']) ? trim($data['teacher']) : '';

// Валидация обязательных полей
if (empty($name) || empty($phone) || empty($email) || empty($teacher)) {
    echo json_encode([
        "result" => "error", 
        "status" => "Пожалуйста, заполните все обязательные поля"
    ]);
    exit;
}

// Валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "result" => "error", 
        "status" => "Укажите корректный email адрес"
    ]);
    exit;
}

// Создаем HTML содержимое письма
$htmlBody = '
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Новая заявка с сайта PomogatorDZ</title>
    <style>
        body {
            font-family: \'Arial\', sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
            margin: 0;
            padding: 20px;
            background-color: #0a0a0a;
        }
        
        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #1a1a1a;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
            border: 1px solid #2a2a2a;
        }
        
        .header {
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            color: white;
            padding: 40px;
            text-align: center;
            border-bottom: 3px solid #4d25eb;
        }
        
        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 15px;
            letter-spacing: 1.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .logo-subtitle {
            font-size: 18px;
            opacity: 0.9;
            color: #b3b3ff;
            margin-top: 10px;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .info-card {
            background: #222222;
            border-radius: 12px;
            padding: 35px;
            margin-bottom: 30px;
            border-left: 5px solid #4d25eb;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .info-item {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #333;
        }
        
        .info-item:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: bold;
            color: #a78bfa;
            min-width: 200px;
            margin-right: 20px;
            font-size: 16px;
            display: flex;
            align-items: center;
        }
        
        .info-value {
            flex: 1;
            color: #ffffff;
            font-size: 18px;
            font-weight: 500;
        }
        
        .highlight {
            background: linear-gradient(135deg, rgba(77, 37, 235, 0.1) 0%, rgba(108, 78, 243, 0.1) 100%);
            border: 1px solid #4d25eb;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        
        .highlight-text {
            color: #b3b3ff;
            font-weight: 600;
            font-size: 18px;
            margin: 0;
        }
        
        .footer {
            background-color: #111111;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #2a2a2a;
            color: #888;
            font-size: 15px;
        }
        
        .footer-logo {
            color: #a78bfa;
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 15px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .timestamp {
            background-color: rgba(77, 37, 235, 0.15);
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 14px;
            color: #a78bfa;
            margin-top: 25px;
            display: inline-block;
            border: 1px solid rgba(77, 37, 235, 0.3);
        }
        
        .icon {
            color: #4d25eb;
            margin-right: 12px;
            font-size: 20px;
            vertical-align: middle;
            filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
        }
        
        .contact-link {
            color: #a78bfa;
            text-decoration: none;
            transition: color 0.3s ease;
            padding: 8px 16px;
            background: rgba(77, 37, 235, 0.1);
            border-radius: 6px;
            display: inline-block;
        }
        
        .contact-link:hover {
            color: #ffffff;
            background: rgba(77, 37, 235, 0.2);
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #4d25eb, transparent);
            margin: 25px 0;
        }
        
        @media only screen and (max-width: 700px) {
            body {
                padding: 10px;
            }
            
            .content {
                padding: 30px 25px;
            }
            
            .header {
                padding: 30px 25px;
            }
            
            .info-item {
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 25px;
                padding-bottom: 15px;
            }
            
            .info-label {
                min-width: auto;
                margin-bottom: 8px;
                margin-right: 0;
            }
            
            .info-card {
                padding: 25px;
            }
            
            .footer {
                padding: 25px;
            }
        }
        
        .data-row {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        
        .data-label {
            background: rgba(77, 37, 235, 0.1);
            padding: 12px 20px;
            font-weight: 600;
            color: #a78bfa;
            border-bottom: 1px solid rgba(77, 37, 235, 0.2);
        }
        
        .data-value {
            padding: 15px 20px;
            color: #ffffff;
            font-size: 16px;
        }
        
        .accent-color {
            color: #a78bfa;
        }
        
        .glow-text {
            text-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Шапка письма -->
        <div class="header">
            <div class="logo glow-text">PomogatorDZ</div>
            <div class="logo-subtitle">Онлайн помощь с выполнением домашних заданий</div>
        </div>
        
        <!-- Основное содержимое -->
        <div class="content">
            <div class="divider"></div>
            
            <div class="info-card">
                <div class="data-row">
                    <div class="data-label">📅 Дата и время заявки</div>
                    <div class="data-value">' . date('d.m.Y в H:i') . '</div>
                </div>
                
                <div class="data-row">
                    <div class="data-label">👤 Имя клиента</div>
                    <div class="data-value">' . htmlspecialchars($name) . '</div>
                </div>
                
                <div class="data-row">
                    <div class="data-label">📱 Телефон для связи</div>
                    <div class="data-value">
                        <a href="tel:' . htmlspecialchars($phone) . '" class="contact-link">
                            ' . htmlspecialchars($phone) . '
                        </a>
                    </div>
                </div>
                
                <div class="data-row">
                    <div class="data-label">✉️ Электронная почта</div>
                    <div class="data-value">
                        <a href="mailto:' . htmlspecialchars($email) . '" class="contact-link">
                            ' . htmlspecialchars($email) . '
                        </a>
                    </div>
                </div>
                
                <div class="data-row">
                    <div class="data-label">🎓 Выбранный курс / учитель</div>
                    <div class="data-value">' . htmlspecialchars($teacher) . '</div>
                </div>
            </div>
            
            <div class="highlight">
                <p class="highlight-text">
                    ⚡ Заявка требует оперативного рассмотрения
                </p>
            </div>
            
            <div class="timestamp">
                📍 Системное время: ' . date('H:i:s') . '
            </div>
        </div>
        
        <!-- Подвал -->
        <div class="footer">
            <div class="footer-logo">PomogatorDZ</div>
            <div>Онлайн помощь с выполнением домашних заданий</div>
            <div style="margin-top: 20px; font-size: 13px; color: #666;">
                Это письмо было сгенерировано автоматически. Пожалуйста, не отвечайте на него.
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #555;">
                © ' . date('Y') . ' PomogatorDZ. Все права защищены.
            </div>
        </div>
    </div>
</body>
</html>';

// Формирование заголовка письма
$title = "Новая заявка с сайта PomogatorDZ";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth = true;
    // $mail->SMTPDebug = 2; // Раскомментировать для отладки
    $mail->Debugoutput = function($str, $level) {
        $GLOBALS['status'][] = $str;
    };

    // Настройки вашей почты
    $mail->Host = 'smtp.mail.ru'; // SMTP сервера вашей почты
    $mail->Username = 'psnsaint@mail.ru'; // Логин на почте
    $mail->Password = 'b5k7nK7HnLe8Gi7cHWa4'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->setFrom('psnsaint@mail.ru', 'Администратор сайта'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress('saint_dev_order@mail.ru');  
    
    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $htmlBody;    

    // Проверяем отравленность сообщения
    if ($mail->send()) {
        $result = "success";
        $status = "Сообщение отправлено успешно";
    } else {
        $result = "error";
        $status = "Сообщение не было отправлено";
    }

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отправляем JSON ответ
echo json_encode([
    "result" => $result, 
    "status" => $status
]);
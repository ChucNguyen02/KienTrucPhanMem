package com.example.bai01.component;

import com.example.bai01.service.MailConsumer;
import com.example.bai01.service.MailProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class ConsoleMenu implements CommandLineRunner {

    @Autowired
    private MailProducer producer;

    @Autowired
    private MailConsumer consumer;

    @Override
    public void run(String... args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\n===== MENU =====");
            System.out.println("1. Chuẩn bị gửi 5 mail (chưa gửi)");
            System.out.println("2. Bắt đầu gửi mail");
            System.out.println("0. Thoát");

            int choice = scanner.nextInt();

            switch (choice) {
                case 1:
                    for (int i = 1; i <= 5; i++) {

                        producer.pushMail("nguyenxuanchuc111" + "@gmail.com");
                    }
                    break;

                case 2:
                    consumer.startSending();
                    break;

                case 0:
                    System.exit(0);
            }
        }
    }
}


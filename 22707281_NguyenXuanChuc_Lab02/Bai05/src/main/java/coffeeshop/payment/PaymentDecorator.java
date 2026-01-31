
package coffeeshop.payment;

public abstract class PaymentDecorator implements Payment {
    protected Payment wrappedPayment;

    public PaymentDecorator(Payment wrappedPayment) {
        this.wrappedPayment = wrappedPayment;
    }

    @Override
    public double getAmount() {
        return wrappedPayment.getAmount();
    }

    @Override
    public String getDescription() {
        return wrappedPayment.getDescription();
    }

    @Override
    public void execute() {
        wrappedPayment.execute();
    }

    @Override
    public void refund() {
        wrappedPayment.refund();
    }

    @Override
    public String getStatus() {
        return wrappedPayment.getStatus();
    }

    @Override
    public void printReceipt() {
        wrappedPayment.printReceipt();  // Delegate về core context
    }
}
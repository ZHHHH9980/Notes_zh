# Programming Assignment 5: Implementing a Reliable Transport Protocol


[Reference](https://media.pearsoncmg.com/aw/aw_kurose_network_3/labs/lab5/lab5.html)

话说真的好考验英语水平啊，翻译和理解都花了好长时间...


## The routines you will write
The procedures you will write are for the sending entity (A) and the receiving entity (B). Only unidirectional transfer of data (from A to B) is required. Of course, the B side will have to send packets to A to acknowledge (positively or negatively) receipt of data. Your routines are to be implemented in the form of the procedures described below. These procedures will be called by (and will call) procedures that I have written which emulate a network environment. The overall structure of the environment is shown in Figure Lab.3-1 (structure of the emulated environment):

你将为发送端和接收端编写程序。只需要考虑A->B的单向数据传输。当然，Bside讲发送ACK给A。你的例程将按按照下面描述的程序来实现。这些程序我将在模拟环境中调用。整体的环境结构图如下图所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/6a0be0d1761a43d0972db3c2b60a7ca7.png)

<br/>

## Software Interfaces
The procedures described above are the ones that you will write. I have written the following routines which can be called by your routines:

- starttimer(calling_entity,increment), where calling_entity is either 0 (for starting the A-side timer) or 1 (for starting the B side timer), and increment is a float value indicating the amount of time that will pass before the timer interrupts. A's timer should only be started (or stopped) by A-side routines, and similarly for the B-side timer. To give you an idea of the appropriate increment value to use: a packet sent into the network takes an average of 5 time units to arrive at the other side when there are no other messages in the medium.

    - `calling_entity` 为0开启A端的计时器，1开启B端的计时器。
    `increment`是一个浮点数，表示在到时之前时间过了多少。A的计时器只应该在A侧开启或者停止。给你一个合适的`increment`的值：当介质中没有其他消息的情况下，发送`packet`平均需要五个时间单位才能到达另一端。


- stoptimer(calling_entity), where calling_entity is either 0 (for stopping the A-side timer) or 1 (for stopping the B side timer).
    - `calling_entity`为0停止A端计时器，为1停止B端计时器。

- tolayer3(calling_entity,packet), where calling_entity is either 0 (for the A-side send) or 1 (for the B side send), and packet is a structure of type pkt. Calling this routine will cause the packet to be sent into the network, destined for the other entity.
    - `calling_entity`为0则代表A端发送，为1则代表B端，`packet`的类型是`pkt`。调用这个程序会将数据包发送到网络中，目的地是另一个实体。

- tolayer5(calling_entity,message), where calling_entity is either 0 (for A-side delivery to layer 5) or 1 (for B-side delivery to layer 5), and message is a structure of type msg. With unidirectional data transfer, you would only be calling this with calling_entity equal to 1 (delivery to the B-side). Calling this routine will cause data to be passed up to layer 5.
    - `calling_entity`为0则代表A端发送，为1则代表B端，`message`的类型是`msg`。由于单向的数据传输，你讲只会使用`calling_entity`为1 （代表发送到B端）。调用这个程序会将数据发送到layer5。

<br/>
<br/>

## The simulated network environment
A call to procedure tolayer3() sends packets into the medium (i.e., into the network layer). Your procedures A_input() and B_input() are called when a packet is to be delivered from the medium to your protocol layer.

调用tolayer3() 会将packet发送到媒介中（网络层）。当一个packet从网络层到你的协议层(传输层)，你程序中的`A_input()`和 `B_input()`将会被调用。

The medium is capable of corrupting and losing packets. It will not reorder packets. When you compile your procedures and my procedures together and run the resulting program, you will be asked to specify values regarding the simulated network environment:

网络层将会导致超时传输和分组丢失。它将不会将分组排序。当你一起编译我俩的程序，然后run一下编译后的程序，你需要指明几个关于模拟网络环境的具体设置值

- **Number of messages to simulate.** My emulator (and your routines) will stop as soon as this number of messages have been passed down from layer 5, regardless of whether or not all of the messages have been correctly delivered. Thus, you need not worry about undelivered or unACK'ed messages still in your sender when the emulator stops. Note that if you set this value to 1, your program will terminate immediately, before the message is delivered to the other side. Thus, this value should always be greater than 1.
    - 模拟消息的数量。不论是否所有消息被正确送达，一旦这么多数量的消息被layer5往下传，我的模拟器将会停止。因此，你不需要担心模拟器停止后没送达或者未ACK的消息还在你的发送器里。注意你的设置必须大于1，否则在消息送达前就会停止你的程序。

- **Loss.** You are asked to specify a packet loss probability. A value of 0.1 would mean that one in ten packets (on average) are lost.
    - 丢失。你将指出丢失的概率。

- **Corruption.** You are asked to specify a packet loss probability. A value of 0.2 would mean that one in five packets (on average) are corrupted. Note that the contents of payload, sequence, ack, or checksum fields can be corrupted. Your checksum should thus include the data, sequence, and ack fields.
    - 超时的概率。
- **Tracing.** Setting a tracing value of 1 or 2 will print out useful information about what is going on inside the emulation (e.g., what's happening to packets and timers). A tracing value of 0 will turn this off. A tracing value greater than 2 will display all sorts of odd messages that are for my own emulator-debugging purposes. A tracing value of 2 may be helpful to you in debugging your code. You should keep in mind that real implementors do not have underlying networks that provide such nice information about what is going to happen to their packets!
    - 追踪。设置1/2将会打印出关于模拟器中数据报和定时器的有效信息。这对debugger非常有帮助
- Average time between messages from sender's layer5. You can set this value to any non-zero, positive value. Note that the smaller the value you choose, the faster packets will be be arriving to your sender.
    - 从发送方layer5传输message的平均时间。

## The Alternating-Bit-Protocol Version of this lab.
You are to write the procedures, A_output(),A_input(),A_timerinterrupt(),A_init(),B_input(), and B_init() which together will implement a stop-and-wait (i.e., the alternating bit protocol, which we referred to as rdt3.0 in the text) unidirectional transfer of data from the A-side to the B-side. Your protocol should use both ACK and NACK messages.

用那些API实现停止与等待协议。你的协议将使用ACK和NACK.

You should choose a very large value for the average time between messages from sender's layer5, so that your sender is never called while it still has an outstanding, unacknowledged message it is trying to send to the receiver. I'd suggest you choose a value of 1000. You should also perform a check in your sender to make sure that when A_output() is called, there is no message currently in transit. If there is, you can simply ignore (drop) the data being passed to the A_output() routine.

你应该选择一个非常大的平均时间给发送放的layer5，这样当你的sender在尝试发送一个NACK，它sender将不会被调用。建议你选择1000.

You should put your procedures in a file called prog2.c. You will need the initial version of this file, containing the emulation routines we have writen for you, and the stubs for your procedures. You can obtain this program from http://gaia.cs.umass.edu/kurose/transport/prog2.c.

你应该将你的程序放入这个prog2.c，你需要它的初始版本，包含了为你编写的模拟程序。

This lab can be completed on any machine supporting C. It makes no use of UNIX features. (You can simply  copy the prog2.c file to whatever machine and OS you choose).

这个实现能在任何支持C语言的机器下完成。不需要任何UNIX的特性。

We recommend that you should hand in a code listing, a design document, and sample output. For your sample output, your procedures might print out a message whenever an event occurs at your sender or receiver (a message/packet arrival, or a timer interrupt) as well as any action taken in response. You might want to hand in output for a run up to the point (approximately) when 10 messages have been ACK'ed correctly at the receiver, a loss probability of 0.1, and a corruption probability of 0.3, and a trace level of 2. You might want to annotate your printout with a colored pen showing how your protocol correctly recovered from packet loss and corruption.

Make sure you read the "helpful hints" for this lab following the description of the Go_Back-N version of this lab.


## Helpful Hints and the like
- Checksumming. You can use whatever approach for checksumming you want. Remember that the sequence number and ack field can also be corrupted. We would suggest a TCP-like checksum, which consists of the sum of the (integer) sequence and ack field values, added to a character-by-character sum of the payload field of the packet (i.e., treat each character as if it were an 8 bit integer and just add them together).
    - 校验和。你可以用任何想用的校验和方法。记住序列号和ack都可能超时腐败。我们更建议类似TCP的校验和
- Note that any shared "state" among your routines needs to be in the form of global variables. Note also that any information that your procedures need to save from one invocation to the next must also be a global (or static) variable. For example, your routines will need to keep a copy of a packet for possible retransmission. It would probably be a good idea for such a data structure to be a global variable in your code. Note, however, that if one of your global variables is used by your sender side, that variable should NOT be accessed by the receiving side entity, since in real life, communicating entities connected only by a communication channel can not share global variables.
    - 注意在你程序中任何共享的状态需要以全局变量的形式存在。不同函数调用直接共享信息也需要存储到全局变量中。
    - 比如，你的程序需要拷贝一个`packet`用于可能需要重传的情况。

- There is a float global variable called time that you can access from within your code to help you out with your diagnostics msgs.
    - 有一个全局的浮点变量called time，你可以用来帮助诊断信息。

- START SIMPLE. Set the probabilities of loss and corruption to zero and test out your routines. Better yet, design and implement your procedures for the case of no loss and no corruption, and get them working first. Then handle the case of one of these probabilities being non-zero, and then finally both being non-zero.
    - 从最简单的开始。将丢失和腐败设置为0来测试你的程序，先让他们跑通，之后再增加难度。

- Debugging. We'd recommend that you set the tracing level to 2 and put LOTS of printf's in your code while your debugging your procedures.

- Random Numbers. The emulator generates packet loss and errors using a random number generator. Our past experience is that random number generators can vary widely from one machine to another. You may need to modify the random number generation code in the emulator we have suplied you. Our emulation routines have a test to see if the random number generator on your machine will work with our code. If you get an error message:
It is likely that random number generation on your machine is different from what this emulator expects. Please take a look at the routine jimsrand() in the emulator code. Sorry.
then you'll know you'll need to look at how random numbers are generated in the routine jimsrand(); see the comments in that routine.


## Other

### C11
估计是使用C11标准的C语言文件，搞了半天都没找到对应的编译器（C89/C90/C99)很多写法都不允许，直接改用线上编译器编译~
https://www.programiz.com/c-programming/online-compiler/


### C struct
C 语言中的struct类型，如何读写（感觉真是现学现卖）：
https://www.tutorialspoint.com/cprogramming/c_structures.htm


### Struct declared immediately after function name/parameters but before brackets

```c
// here is the code
A_output(message) 
 struct msg message;
{

}
```
https://stackoverflow.com/questions/28973227/struct-declared-immediately-after-function-name-parameters-but-before-brackets

### Example: C strcpy()

```c
#include <stdio.h>
#include <string.h>

int main() {
  char str1[20] = "C programming";
  char str2[20];

  // copying str1 to str2
  strcpy(str2, str1);

  puts(str2); // C programming

  return 0;
}
```
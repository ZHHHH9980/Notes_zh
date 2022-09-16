# rdt1.0

纸上得来终觉浅，绝知此事要躬行。听老师讲课很容易，刷刷就过去了，真正要自己动手去实现一个，真的很难...从看懂实验，理解API，补了一下C语言的一些语法，到写出这个乞丐版都花了整整一天时间...
如果纯粹是为了面试我觉得没必要，但是不得不佩服国外的教学，追求的不仅是知识本身，而是探索知识的动手能力。文档不清楚的地方就搜，就问，C语言哪里不懂就查（能查出来说实话都需要一定的能力）

比如说这种写法：
```c
A_output(message) struct msg message;
```
选择1，原原本本的拿着这行代码去stackoverflow上问，问题是不会有人马上给你做出解答，你需要等待。
选择2，把它抽象出来，说不定有共性问题。
这里的情况就是在函数的括号后面声明了message的类型，显然是不符合C99的规范的。
于是我在搜索框里写，declartion type after bracket in c
然后查到这篇：
https://stackoverflow.com/questions/39064582/why-variables-are-declared-outside-brackets
才知道上面的写法是等价于:
```c
int A_output(struct msg message)
```

## 乞丐版code

```c
/********* STUDENTS WRITE THE NEXT SEVEN ROUTINES *********/

int Aside = 0;
int Bside = 1;

/* called from layer 5, passed the data to be sent to other side */
A_output(message) struct msg message;
{
    struct pkt packet;
    packet.acknum = 0;
    packet.seqnum = 0;
    packet.checksum = 0;
    strcpy(packet.payload, message.data);

    printf("Sender: receive data from upperlayer");
    // where calling_entity is either 0 (for the A-side send)
    A_input(packet);

    return 0;
}

B_output(message) /* need be completed only for extra credit */
    struct msg message;
{
}

/* called from layer 3, when a packet arrives for layer 4 */
A_input(packet) struct pkt packet;
{
    printf("\n Sender: send packet to B side");
    tolayer3(Aside, packet);
}

/* called when A's timer goes off */
A_timerinterrupt()
{
}

/* the following routine will be called once (only) before any other */
/* entity A routines are called. You can use it to do any initialization */
A_init()
{
}

/* Note that with simplex transfer from a-to-B, there is no B_output() */

/* called from layer 3, when a packet arrives for layer 4 at B*/
B_input(packet) struct pkt packet;
{
    printf("\n Receiver: get packet successfully!");
    tolayer5(Bside, packet);
}

/* called when B's timer goes off */
B_timerinterrupt()
{
}

/* the following rouytine will be called once (only) before any other */
/* entity B routines are called. You can use it to do any initialization */
B_init()
{
}

```


不论多乞丐，至少成功传到了B侧的layer5。
![在这里插入图片描述](https://img-blog.csdnimg.cn/fc6b76ab7a064829b3460333cab25580.png)

---
title: 重拾十大经典排序算法
tags: Program-C
reward: true
categories: Program-C
toc: true
abbrlink: 39639
date: 2016-06-05 10:14:50
---

最近在工作中偶然间涉及到数据库的存储和访问，数据库里存放着员工的指纹、年龄以及姓名等信息，当然指纹是通过`md5`加密存储的。目前需要对员工的年龄、学历、工作年限等进行排序，如果只有几十个上百个样本，应该不会那么麻烦；关键这是几万名员工的数据，这个量很大，马虎不得。悄悄的告诉你，别惹我，我懂得删库跑路哦。

脑海中对排序的记忆有点模糊，只对<span  style="color: #1976D2; ">「归并排序」</span>印象较为深刻，为了加深理解，重拾<span  style="color: #1976D2; ">「数据结构与算法」</span>，并总结了一下常用的十大经典排序算法，由于平台为`linux`，因此代码全部用`C++`实现，全部源码均在`linux`下编译通过并测试成功，可以作为参考。

<!--more-->

排序算法在程序猿的编程生涯中虽然用的不多，但是作为基本功，还是要掌握一下。排序算法是<span  style="color: #1976D2; ">「数据结构与算法」</span>中最基本的算法，它分为<span  style="color: #1976D2; ">「内部排序」</span>和<span  style="color: #1976D2; ">「外部排序」</span>；<span  style="color: #1976D2; ">「内部排序」</span>一般在内存中实现；当数据量很大时，内存有限，不能将所有的数据都放到内存中来，这个时候必须使用<span  style="color: #1976D2; ">「外部排序」</span>。

先看一张图，对常用算法的时间复杂度做个比较：

| 排序算法 | 平均时间复杂度  | 最佳情况        | 最坏情况        | 空间复杂度  | 排序方式  | 稳定性 |
| -------- | --------------- | --------------- | --------------- | ----------- | --------- | ------ |
| 冒泡排序 | $O(n^2)$        | $O(n)$          | $O(n^2)$        | $O(1)$      | In-place  | 稳定   |
| 选择排序 | $O(n^2)$        | $O(n^2)$        | $O(n^2)$        | $O(1)$      | In-place  | 不稳定 |
| 插入排序 | $O(n^2)$        | $O(n)$          | $O(n^2)$        | $O(1)$      | In-place  | 稳定   |
| 希尔排序 | $O(n \log n)$   | $O(n \log^2 n)$ | $O(n \log^2 n)$ | $O(1)$      | In-place  | 不稳定 |
| 归并排序 | $O(n \log n)$   | $O(n \log n)$   | $O(n \log n)$   | $O(n)$      | Out-place | 稳定   |
| 快速排序 | $O(n \log n)$   | $O(n \log n)$   | $O(n^2)$        | $O(\log n)$ | In-place  | 不稳定 |
| 堆排序   | $O(n \log n)$   | $O(n \log n)$   | $O(n \log n)$   | $O(1)$      | In-place  | 不稳定 |
| 计数排序 | $O(n+k)$        | $O(n+k)$        | $O(n+k)$        | $O(k)$      | Out-place | 稳定   |
| 桶排序   | $O(n+k)$        | $O(n+k)$        | $O(n^2)$        | $O(n+k)$    | Out-place | 稳定   |
| 基数排序 | $O(n \times k)$ | $O(n \times k)$ | $O(n \times k)$ | $O(n+k)$    | Out-place | 稳定   |


这里的<span  style="color: #1976D2; ">「稳定」</span>是指当排序后两个相等键值的顺序和排序之前的顺序相同；

- n: 代表数据规模及数据量大小
- k: 桶的个数
- In-place: 不占用额外内存，只占用常数内存
- Out-place: 占用额外内存



## <span  style="color: #1976D2; ">一 冒泡排序</span>
冒泡排序是排序算法中较为简单的一种，英文称为`Bubble Sort。`它遍历所有的数据，每次对相邻元素进行两两比较，如果顺序和预先规定的顺序不一致，则进行位置交换；这样一次遍历会将最大或最小的数据上浮到顶端，之后再重复同样的操作，直到所有的数据有序。

如果有$n$个数据，那么需要$O(n^2)$的比较次数，所以当数据量很大时，冒泡算法的效率并不高。
当输入的数据是反序时，花的时间最长，当输入的数据是正序时，时间最短。

<span  style="color: #43A047; ">平均时间复杂度</span>：<span  style="color: #D32F2F; ">$O(n^2)$</span>

<span  style="color: #43A047; ">空间复杂度</span>：<span  style="color: #D32F2F; ">$O(1)$</span>

动态演示：
![](/images/imageProgramC/bubbleSort.gif)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <algorithm>

using namespace std;

template<typename T> //整数或浮点数皆可使用

void bubble_sort(T arr[], int len) {
	int i, j;
	for (i = 0; i < len - 1; i++){
		for (j = 0; j < len - 1 - i; j++)
			if (arr[j] > arr[j + 1])
				swap(arr[j], arr[j + 1]);
       }
}

int main() {
	int arr[] = { 61, 17, 29, 22, 34, 60, 72, 21, 50, 1, 62 };
	int len = (int) sizeof(arr) / sizeof(*arr);
	bubble_sort(arr, len);
	for (int i = 0; i < len; i++)
		cout << arr[i] << ' ';
	cout << endl;
	float arrf[] = { 17.5, 19.1, 0.6, 1.9, 10.5, 12.4, 3.8, 19.7, 1.5, 25.4, 28.6, 4.4, 23.8, 5.4 };
	len = (int) sizeof(arrf) / sizeof(*arrf);
	bubble_sort(arrf, len);
	for (int i = 0; i < len; i++)
		cout << arrf[i] << ' ';
	return 0;
}
```

</details>

新建代码文件`bubble_sort.cpp，`将以上代码写入，`linux`下编译：

```shell
$ g++ -o bubble_sort bubble_sort.cpp
```
测试：
```shell
$ ./bubble_sort
```
输出结果：
```shell
1 17 21 22 29 34 50 60 61 62 72
0.6 1.5 1.9 3.8 4.4 5.4 10.5 12.4 17.5 19.1 19.7 23.8 25.4 28.6
```
以下的编译方法和测试方法和这里一样，所以下面不再重复编译和测试的说明。

## <span  style="color: #1976D2; ">二 选择排序</span>

选择排序简单直观，英文称为`Selection Sort，`先在数据中找出最大或最小的元素，放到序列的起始；然后再从余下的数据中继续寻找最大或最小的元素，依次放到排序序列中，直到所有数据样本排序完成。很显然，选择排序也是一个费时的排序算法，无论什么数据，都需要$O(n^2)$的时间复杂度，不适宜大量数据的排序。

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n^2)$</span>

<span  style="color: #43A047; ">空间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(1)$</span>

动态演示：

![](/images/imageProgramC/selectionSort.gif)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <algorithm>

using namespace std;

template<typename T> //整数或浮点数皆可使用

void selection_sort(T arr[],int len ) {
	for (int i = 0; i < len  - 1; i++) {
		int min = i;
		for (int j = i + 1; j < len; j++)
			if (arr[j] < arr[min])
				min = j;
		std::swap(arr[i], arr[min]);
	}
}
int main() {
	float arrf[] = { 17.5, 19.1, 0.6, 1.9, 10.5, 12.4, 3.8, 19.7, 1.5, 25.4, 28.6, 4.4, 23.8, 5.4 };
	int len = (int) sizeof(arrf) / sizeof(*arrf);	
	selection_sort(arrf,len);
	for (int i = 0; i < len; i++)
		cout << arrf[i] << ' ';
	return 0;
}
```

</details>

## <span  style="color: #1976D2; ">三 插入排序</span>

插入排序英文称为`Insertion Sort，`它通过构建有序序列，对于未排序的数据序列，在已排序序列中从后向前扫描，找到相应的位置并插入，类似打扑克牌时的码牌。插入排序有一种优化的算法，可以进行拆半插入。

基本思路是先将待排序序列的第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列；然后从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置，直到所有数据都完成排序；如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n^2)$</span>

<span  style="color: #43A047; ">空间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(1)$</span>

动态演示：
![](/images/imageProgramC/insertionSort.gif)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <algorithm>

using namespace std;

template<typename T> //整数或浮点数皆可使用

void insertion_sort(T arr,int len){
    for(int i=1;i<len;i++){
        T key=arr[i];
        int j;
        for(j=i-1;j>=0 && key<arr[j];j--)
        	arr[j+1]=arr[j];
        arr[j+1]=key;
    }
}

int main() {
	float arrf[] = { 17.5, 19.1, 0.6, 1.9, 10.5, 12.4, 3.8, 19.7, 1.5, 25.4, 28.6, 4.4, 23.8, 5.4 };
	int len = (int) sizeof(arrf) / sizeof(*arrf);	
	insertion_sort(arrf,len);
	for (int i = 0; i < len; i++)
		cout << arrf[i] << ' ';
	return 0;
}
```

</details>


## <span  style="color: #1976D2; ">四 希尔排序</span>

希尔排序也称递减增量排序，是插入排序的一种改进版本，英文称为`Shell Sort`，效率虽高，但它是一种不稳定的排序算法。

插入排序在对几乎已经排好序的数据操作时，效果是非常好的；但是插入排序每次只能移动一位数据，因此插入排序效率比较低。

希尔排序在插入排序的基础上进行了改进，它的基本思路是先将整个数据序列分割成若干子序列分别进行直接插入排序，待整个序列中的记录基本有序时，再对全部数据进行依次直接插入排序。

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n \log n)$</span>

<span  style="color: #43A047; ">空间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(1)$</span>

假如有这样一组数据，<span  style="color: #1976D2; ">[ 13 14 94 33 82 25 59 94 65 23 45 27 73 25 39 10 ]，</span>如果以步长`5`进行分割，每一列为一组，那么这组数据应该首先分成这样
```shell
13 14 94 33 82
25 59 94 65 23
45 27 73 25 39
10
```
之后对每列进行插入排序：
```shell
10 14 73 25 23
13 27 94 33 39
25 59 94 65 82
45
```
将上述四行数据依序拼接在一起，得到<span  style="color: #1976D2; ">[ 10 14 73 25 23 13 27 94 33 39 25 59 94 65 82 45 ]，</span>此时`10`已经移到正确的顺序了，之后以步长`3`进行插入排序：
```shell
10 14 73
25 23 13
27 94 33
39 25 59
94 65 82
45
```
排序之后变为：
```shell
10 14 13
25 23 33
27 25 59
39 65 73
45 94 82
94
```
最后以步长 1 进行排序。

步长的选择是希尔排序的关键，只要最终步长为`1`，任何步长序列都可以。建议最初步长选择为数据长度的一半，直到最终的步长为`1`。

图解：

![](/images/imageProgramC/shell.png)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <algorithm>

using namespace std;

template<typename T>

void shell_sort(T array[], int length) {
    int h = 1;
    while (h < length / 3) {
        h = 3 * h + 1;
    }
    while (h >= 1) {
        for (int i = h; i < length; i++) {
            for (int j = i; j >= h && array[j] < array[j - h]; j -= h) {
                std::swap(array[j], array[j - h]);
            }
        }
        h = h / 3;
    }
}

int main() {	
	int arrf[] = { 13，14，94，33，82，25，59，94，65，23，45，27，73，25，39，10 };
	int len = (int) sizeof(arrf) / sizeof(*arrf);	
	shell_sort(arrf,len);
	for (int i = 0; i < len; i++)
		cout << arrf[i] << ' ';
	return 0;
}
```

</details>

## <span  style="color: #1976D2; ">五 归并排序</span>

归并排序英文称为`Merge Sort`，归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法`（Divide and Conquer）`的一个非常典型的应用。它首先将数据样本拆分为两个子数据样本, 并分别对它们排序, 最后再将两个子数据样本合并在一起; 拆分后的两个子数据样本序列, 再继续递归的拆分为更小的子数据样本序列, 再分别进行排序, 直到最后数据序列为1，而不再拆分，此时即完成对数据样本的最终排序。 

归并排序严格遵循从左到右或从右到左的顺序合并子数据序列, 它不会改变相同数据之间的相对顺序, 因此归并排序是一种稳定的排序算法.

作为一种典型的分而治之思想的算法应用，归并排序的实现分为两种方法：

- 自上而下的递归；
- 自下而上的迭代；

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n \log n)$</span>

<span  style="color: #43A047; ">空间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n)$</span>

动态演示：

![](/images/imageProgramC/mergeSort.gif)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <algorithm>

using namespace std;

template<typename T> 

void merge_sort_iteration(T arr[], int len) {//迭代法
	T* a = arr;
	T* b = new T[len];
	for (int seg = 1; seg < len; seg += seg) {
		for (int start = 0; start < len; start += seg + seg) {
			int low = start, mid = min(start + seg, len), high = min(start + seg + seg, len);
			int k = low;
			int start1 = low, end1 = mid;
			int start2 = mid, end2 = high;
			while (start1 < end1 && start2 < end2)
				b[k++] = a[start1] < a[start2] ? a[start1++] : a[start2++];
            
			while (start1 < end1)
				b[k++] = a[start1++];
            
			while (start2 < end2)
				b[k++] = a[start2++];
		}
		T* temp = a;
		a = b;
		b = temp;
	}
	if (a != arr) {
		for (int i = 0; i < len; i++)
			b[i] = a[i];
		b = a;
	}
	delete[] b;
}

template<typename T> 
void merge_sort_recursive_t(T arr[], T reg[], int start, int end) {//递归法
	if (start >= end)
		return;
    
	int len = end - start, mid = (len >> 1) + start;
	int start1 = start, end1 = mid;
	int start2 = mid + 1, end2 = end;
	merge_sort_recursive_t(arr, reg, start1, end1);
	merge_sort_recursive_t(arr, reg, start2, end2);
    
	int k = start;
	while (start1 <= end1 && start2 <= end2)
		reg[k++] = arr[start1] < arr[start2] ? arr[start1++] : arr[start2++];
    
	while (start1 <= end1)
		reg[k++] = arr[start1++];
    
	while (start2 <= end2)
		reg[k++] = arr[start2++];
    
	for (k = start; k <= end; k++)
		arr[k] = reg[k];
}

template<typename T> 
void merge_sort_recursive(T arr[], const int len) {
	T *reg = new T[len];
	merge_sort_recursive_t(arr, reg, 0, len - 1);
	delete[] reg;
}

int main() {	
	float arrf[] = { 17.5, 19.1, 0.6, 1.9, 10.5, 12.4, 3.8, 19.7, 1.5, 25.4, 28.6, 4.4, 23.8, 5.4 };
	int len = (int) sizeof(arrf) / sizeof(*arrf);	
	merge_sort_recursive(arrf,len);
	for (int i = 0; i < len; i++)
		cout << arrf[i] << ' ';
		
	merge_sort_iteration(arrf,len);
	for (int i = 0; i < len; i++)
		cout << arrf[i] << ' ';
	return 0;
}
```
</details>

## <span  style="color: #1976D2; ">六 快速排序</span>
快速排序,英文称为Quicksort，又称划分交换排序 partition-exchange sort 简称快排。

快速排序使用分治法（Divide and conquer）策略来把一个序列（list）分为两个子序列（sub-lists）。首先从数列中挑出一个元素，并将这个元素称为「基准」，英文pivot。重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任何一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。之后，在子序列中继续重复这个方法，直到最后整个数据序列排序完成。

在平均状况下，排序n个项目要$O(n \log n)$次比较。在最坏状况下则需要$O(n^2)$次比较，但这种状况并不常见。事实上，快速排序通常明显比其他算法更快，因为它的内部循环可以在大部分的架构上很有效率地达成。

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; "> $O(n \log n)$</span>

<span  style="color: #43A047; ">空间复杂度</span>： </span>：<span  style="color: #D32F2F; ">$O(\log n)$</span>

动态演示：

![](/images/imageProgramC/quickSort.gif)

更直观一些的动图演示：

![](/images/imageProgramC/Sorting_quicksort_anim.gif)

代码分两种方式实现，分别为迭代法和递归法。

<details><summary>迭代法：</summary>

```c++
struct Range {
    int start, end;
    Range(int s = 0, int e = 0) {
        start = s, end = e;
    }
};

template <typename T> // 
void quick_sort(T arr[], const int len) {
    if (len <= 0)
        return; // 
    
    Range r[len];
    int p = 0;
    r[p++] = Range(0, len - 1);
    while (p) {
        Range range = r[--p];
        if (range.start >= range.end)
            continue;
        
        T mid = arr[range.end];
        int left = range.start, right = range.end - 1;
        while (left < right) {
            while (arr[left] < mid && left < right) left++;
            while (arr[right] >= mid && left < right) right--;
            std::swap(arr[left], arr[right]);
        }
        if (arr[left] >= arr[range.end])
            std::swap(arr[left], arr[range.end]);
        else
            left++;
        
        r[p++] = Range(range.start, left - 1);
        r[p++] = Range(left + 1, range.end);
    }
}
```
</details>

<details><summary>递归法：</summary>

```c++
template <typename T>
void quick_sort_recursive(T arr[], int start, int end) {
    if (start >= end)
        return;
    
    T mid = arr[end];
    int left = start, right = end - 1;
    while (left < right) {
        while (arr[left] < mid && left < right)
            left++;
        while (arr[right] >= mid && left < right)
            right--;
        std::swap(arr[left], arr[right]);
    }
    if (arr[left] >= arr[end])
        std::swap(arr[left], arr[end]);
    else
        left++;
    
    quick_sort_recursive(arr, start, left - 1);
    quick_sort_recursive(arr, left + 1, end);
}

template <typename T> //
void quick_sort(T arr[], int len) {
    quick_sort_recursive(arr, 0, len - 1);
}
```

</details>

## <span  style="color: #1976D2; ">七 堆排序</span>
堆排序，英文称Heapsort，是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序实现分为两种方法：

1. 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
2. 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

算法步骤：
1. 创建一个堆 H[0……n-1]；
2. 把堆首（最大值）和堆尾互换；
3. 把堆的尺寸缩小 1，并调用 shift_down(0)，目的是把新的数组顶端数据调整到相应位置；
4. 重复步骤 2，直到堆的尺寸为 1

<span  style="color: #43A047; ">平均时间复杂度</span>： </span>：<span  style="color: #D32F2F; ">$O(n \log n)$</span>

<span  style="color: #43A047; ">空间复杂度</span>： </span>：<span  style="color: #D32F2F; ">$O(1)$</span>

动图演示：

![](/images/imageProgramC/Sorting_heapsort_anim.gif)

来一个更直观一些的：

![](/images/imageProgramC/heapSort.gif)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <algorithm>

using namespace std;

void max_heapify(int arr[], int start, int end) {
	//建立父节点指标和子节点指标
	int dad = start;
	int son = dad * 2 + 1;
	while (son <= end) { //子节点指标在范围内才做比较
		if (son + 1 <= end && arr[son] < arr[son + 1]) //比较两个子节点大小，选择最大的
			son++;
		if (arr[dad] > arr[son]) //如果父节点大于子节点代表调整完毕，直接跳出函数
			return;
		else { //否則交换父子内容再继续子节点和孙节点比较
			swap(arr[dad], arr[son]);
			dad = son;
			son = dad * 2 + 1;
		}
	}
}

void heap_sort(int arr[], int len) {
	//初始化，i从最后一个父节点开始调整
	for (int i = len / 2 - 1; i >= 0; i--)
		max_heapify(arr, i, len - 1);
	//先將第一个元素和已经排好的元素前一位做交换，再重调整，(刚调整的元素之前的元素)，直到排序完毕
	for (int i = len - 1; i > 0; i--) {
		swap(arr[0], arr[i]);
		max_heapify(arr, 0, i - 1);
	}
}

int main() {
	int arr[] = { 3, 5, 3, 0, 8, 6, 1, 5, 8, 6, 2, 4, 9, 4, 7, 0, 1, 8, 9, 7, 3, 1, 2, 5, 9, 7, 4, 0, 2, 6 };
	int len = (int) sizeof(arr) / sizeof(*arr);
	heap_sort(arr, len);
	for (int i = 0; i < len; i++)
		cout << arr[i] << ' ';
	cout << endl;
	return 0;
}
```
</details>

## <span  style="color: #1976D2; ">八 计数排序</span>
计数排序英文称Counting sort，是一种稳定的线性时间排序算法。计数排序使用一个额外的数组C，其中第i个元素是待排序数组A中值等于  i的元素的个数。然后根据数组C来将A中的元素排到正确的位置。基本的步骤如下：
1. 找出待排序的数组中最大和最小的元素
2. 统计数组中每个值为i的元素出现的次数，存入数组C的第i项
3. 对所有的计数累加,从C中的第一个元素开始，每一项和前一项相加
4. 反向填充目标数组,将每个元素i放在新数组的第C[i]项，每放一个元素就将C[i]减去1

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n + k )$</span>

<span  style="color: #43A047; ">空间复杂度</span>： </span>：<span  style="color: #D32F2F; ">$O(k)$</span>

动图演示：

![](/images/imageProgramC/countingSort.gif)

<details><summary>代码：</summary>

```c++
void  Count_Sort(int* Data, int Len)
{
    int* Cout = NULL;           
    Cout = (int*)malloc(sizeof(int) * Len);   
    //初始化记数为0
    for (int i = 0; i < Len; i++) {
        Cout[i] = 0;
    }

    //记录重复的个数
    for (int i = 0; i < Len; i++) {
        Cout[Data[i]] += 1;   
    }

    //确定不比该位置大的数据个数。
    for (int i = 1; i < Len; i++) {
        Cout[i] += Cout[i - 1];    
    }

    int* Sort = NULL;           
    Sort = (int*)malloc(sizeof(int) * Len);   

    for (int i = 0; i < Len; i++) {
        //将数组反向填充到Sort，每次拿出一个就减一
        Cout[Data[i]] -= 1;   
        Sort[Cout[Data[i]]] = Data[i];           
    }

    //排序结束，将排序好的数据复制到原来数组中。
    for (int i = 0; i < Len; ++i) {
        Data[i] = Sort[i];
    }

    //释放申请的空间。
    free(Cout);
    free(Sort);
}
```

</details>

## <span  style="color: #1976D2; ">九 桶排序</span>
桶排序也称为箱排序，英文称为 Bucket Sort。它是将数组划分到一定数量的有序的桶里，然后再对每个桶中的数据进行排序，最后再将各个桶里的数据有序的合并到一起。

<span  style="color: #43A047; ">平均时间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n + k)$</span>

<span  style="color: #43A047; ">空间复杂度</span>：</span>：<span  style="color: #D32F2F; ">$O(n + k)$</span>

动态演示：

![](/images/imageProgramC/bucketsort.gif)

<details><summary>代码：</summary>

```c++
#include <iostream>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
using namespace std;

struct tNode
{
	int tValue; 
	tNode *next; 

	tNode(int val) 
	{
		this->tValue = val;
		this->next = NULL;
	}
};

bool bucket_sort(int *arrf, const int SIZE)
{
	tNode **pNode = (tNode **)malloc(sizeof(tNode *) * 512);
	if (NULL == pNode)
		return false;

	memset(pNode, 0, sizeof(tNode *) * 512);

	int shiftNum = 0;
	tNode *p = NULL;
	tNode *pLast = NULL;
	tNode *pNewNode = NULL;

	for (int i = 0; i < SIZE; ++i) {
		shiftNum = arrf[i] >> 24;
		p = pNode[shiftNum];

		pNewNode = new tNode(arrf[i]);
		if (NULL == pNewNode)
			return false;

		if (NULL == p) {
			pNode[shiftNum] = pNewNode;
		}
		else if (arrf[i] <= p->tValue) {
			pNode[shiftNum] = pNewNode;
			pNewNode->next = p;
		}
		else {
			while (NULL != p->next) {
				if (arrf[i] > p->next->tValue)
					p = p->next;
				else
					break;
			}
			pNewNode->next = p->next;
			p->next = pNewNode;
		}
	}

	for (int i = 0, k = 0; i < 512; i++) {
		p = pNode[i];

		while (NULL != p) {
			arrf[k++] = p->tValue;
			p = p->next;
		}
	}
	return true;
}

int main(int argc, char **argv)
{
	int arr[] = { 5,558,772,935,344,487,96,665,302,735,954,308,718,147,185,371,166,849,202,478,874,169,980,125,44,15,279,882,466,974 };
	
	bucket_sort(arr,30);
	for (int i = 0; i < 30; ++i) {
		cout<<arr[i]<<" ";
	} 
	cout<<endl;
	
	return 0;
}
```

</details>

## <span  style="color: #1976D2; ">十 基数排序</span>
基数排序英文称Radix sort，是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串和特定格式的浮点数，所以基数排序也仅限于整数。它首先将所有待比较数值，统一为同样的数位长度，数位较短的数前面补零。然后，从最低位开始，依次进行一次排序。这样从最低位排序一直到最高位排序完成以后，数列就变成一个有序序列。

<span  style="color: #43A047; ">平均时间复杂度</span>： </span>：<span  style="color: #D32F2F; ">$O(n \times k)$</span>

<span  style="color: #43A047; ">空间复杂度</span>： </span>：<span  style="color: #D32F2F; ">$O(n + k )$</span>

动态演示：

![](/images/imageProgramC/radixSort.gif)

<details><summary>代码：</summary>

```c++
int maxbit(int data[], int n) //辅助函数，求数据的最大位数
{
    int maxData = data[0];		///< 最大数
    /// 先求出最大数，再求其位数，这样有原先依次每个数判断其位数，稍微优化点。
    for (int i = 1; i < n; ++i) {
        if (maxData < data[i])
            maxData = data[i];
    }
    
    int d = 1;
    int p = 10;
    while (maxData >= p) {
        //p *= 10; // Maybe overflow
        maxData /= 10;
        ++d;
    }
    return d;
/*  int d = 1; //保存最大的位数
    int p = 10;
    for(int i = 0; i < n; ++i)
    {
        while(data[i] >= p)
        {
            p *= 10;
            ++d;
        }
    }
    return d;*/
}

void radixsort(int data[], int n) //基数排序
{
    int d = maxbit(data, n);
    int *tmp = new int[n];
    int *count = new int[10]; //计数器
    int i, j, k;
    int radix = 1;
    for(i = 1; i <= d; i++) //进行d次排序
    {
        for(j = 0; j < 10; j++)
            count[j] = 0; //每次分配前清空计数器
        
        for(j = 0; j < n; j++) {
            k = (data[j] / radix) % 10; //统计每个桶中的记录数
            count[k]++;
        }
        
        for(j = 1; j < 10; j++)
            count[j] = count[j - 1] + count[j]; //将tmp中的位置依次分配给每个桶
        
        for(j = n - 1; j >= 0; j--) {  //将所有桶中记录依次收集到tmp中      
            k = (data[j] / radix) % 10;
            tmp[count[k] - 1] = data[j];
            count[k]--;
        }
        
        for(j = 0; j < n; j++) //将临时数组的内容复制到data中
            data[j] = tmp[j];
        
        radix = radix * 10;
    }
    delete []tmp;
    delete []count;
}
```

</details>

## <span  style="color: #1976D2; ">参考</span>
<span  style="color: #1976D2; ">wiki</span>
<span  style="color: #1976D2; ">https://github.com/hustcc/JS-Sorting-Algorithm</span>
<span  style="color: #1976D2; ">「数据结构与算法」</span>
<span  style="color: #1976D2; ">「算法导论」</span>


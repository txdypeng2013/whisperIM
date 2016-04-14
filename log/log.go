package log

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"time"
)

var toHide string

func init() {
	if _, file, _, ok := runtime.Caller(1); ok {
		index := strings.Index(file, "/src/")
		toHide = file[0 : index+5]
		left := strings.Replace(file, toHide, "", 1)
		index = strings.Index(left, "/")
		toHide = toHide + left[0:index]
	}
}

func Info(msg ...interface{}) {

	if _, file, line, ok := runtime.Caller(1); ok {
		file = strings.Replace(file, toHide, "", 1)
		var fmtInfo []interface{}
		fmtInfo = append(fmtInfo, time.Now().Format("2006-01-02 15:04:05"), "[ info]", file, line)
		for _, v := range msg {
			fmtInfo = append(fmtInfo, v)
		}
		fmt.Fprintln(os.Stdout, fmtInfo...)
	}
}

func Error(msg ...interface{}) {

	if _, file, line, ok := runtime.Caller(1); ok {
		file = strings.Replace(file, toHide, "", 1)
		var fmtInfo []interface{}
		fmtInfo = append(fmtInfo, time.Now().Format("2006-01-02 15:04:05"), "[error]", file, line)
		for _, v := range msg {
			fmtInfo = append(fmtInfo, v)
		}
		fmt.Fprintln(os.Stdout, fmtInfo...)
	}
}

func Warn(msg ...interface{}) {

	if _, file, line, ok := runtime.Caller(1); ok {
		file = strings.Replace(file, toHide, "", 1)
		var fmtInfo []interface{}
		fmtInfo = append(fmtInfo, time.Now().Format("2006-01-02 15:04:05"), "[ warn]", file, line)
		for _, v := range msg {
			fmtInfo = append(fmtInfo, v)
		}
		fmt.Fprintln(os.Stdout, fmtInfo...)
	}
}

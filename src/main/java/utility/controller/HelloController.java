package utility.controller;

import com.hxg.Student;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.Map;

@Controller
@RequestMapping(value = "/hello1")
@SessionAttributes(value = "student")
public class HelloController {
    //@Resource
    //Student student;

    /*@ModelAttribute
    public String test(String text){
        text = "22";
        System.out.println("text is:" + text);
        return text;
    }*/

    @RequestMapping(value = "/hello2", method = RequestMethod.POST)
    public String printHello(Student a, HttpServletRequest request, Model model,HttpSession session) {
        System.out.println(model.containsAttribute("student"));
        System.out.println("post");
        System.out.println("是否已執行sessionAttributes:"+session.getAttribute("student"));
        //model.addAttribute("message", "Hello, my name is"+ student.getName());
        String data = request.getParameter("text");
        System.out.println("Hello Spring MVC..." + a.getText());
        return "hello";
    }
    @RequestMapping(value = "/hello2", method = RequestMethod.GET)
    public String printHello2(@ModelAttribute Student aa, HttpServletRequest request, Model model) {
        System.out.println(model.containsAttribute("student"));
        System.out.println(model.containsAttribute("aa"));
        System.out.println(model.toString());
        System.out.println("RequestMethod.GET..."+ aa.getText());
        return "hello";
    }
    @ModelAttribute
    public Student printHello2(Model model,HttpSession session) {
        System.out.println(model.containsAttribute("student"));
        System.out.println("@ModelAttribute function executed..");
        System.out.println("是否已執行sessionAttributes:"+session.getAttribute("student"));
        return new Student();
    }
    @RequestMapping("/test")
    public String test(Map<String,Object> map){
        map.put("names", Arrays.asList("caoyc","zhh","cjx"));
        map.put("age", 18);
        return "hello";
        }
}
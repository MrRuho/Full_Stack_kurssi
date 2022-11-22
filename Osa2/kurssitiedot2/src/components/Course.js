
const Header = ({course}) => {

    return (
        <div>
            <h2>
                {course.name}
            </h2>
        </div>
    )
}
    
const Part = ({note}) => {

    return (
        <p>
            {note.name} {note.exercises}
        </p> 
    )
}


const Content = ({course}) => {

    return (
        <div>          
            {course.parts.map(note =>
                <Part key ={note.id} note={note}/>
            )}          
        </div>
    )
}

const Total = ({course}) => {
    var total = course.parts.reduce(function(sum, points){
        return sum + points.exercises
    }, 0)

    return(
        <div>
            <h3>
                Total of exercises {total}
            </h3>
        </div>
    )
}


const Course = ({ course }) => {

    return (
        <div>
            <Header course={course}/>
            <Content course={course}/>
            <Total course={course}/>
        </div>         
    )
}

export default Course
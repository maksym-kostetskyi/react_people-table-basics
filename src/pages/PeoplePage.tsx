import { Link, NavLink, useParams } from 'react-router-dom';
import { Person } from '../types';
import { Outlet } from 'react-router-dom';
import classNames from 'classnames';
import { Loader } from '../components/Loader';

type Props = {
  people: Person[] | undefined;
  loading: boolean;
  error: boolean;
};

export const PeoplePage: React.FC<Props> = ({ people, loading, error }) => {
  const { slug } = useParams();
  const selectedPerson = slug;
  const peopleWithParents = people?.map(person => ({
    ...person,
    mother: people.find(p => p.name === person.motherName),
    father: people.find(p => p.name === person.fatherName),
  }));

  const getRelativeLink = (
    person: Person,
    whoseName: 'fatherName' | 'motherName',
  ) => {
    const who: 'mother' | 'father' = whoseName.slice(0, -4) as
      | 'mother'
      | 'father';

    if (person[whoseName]) {
      if (person[who]) {
        return (
          <Link
            to={`/people/${person[who].slug}`}
            className={classNames('', {
              'has-text-danger': person[who].sex === 'f',
            })}
          >
            {person[who].name}
          </Link>
        );
      } else {
        return person[whoseName];
      }
    } else {
      return '-';
    }
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      {loading && <Loader />}

      {!loading && error && (
        <p data-cy="peopleLoadingError" className="has-text-danger">
          Something went wrong
        </p>
      )}

      {!loading && !error && people?.length === 0 && (
        <p data-cy="noPeopleMessage">There are no people on the server</p>
      )}

      {!loading && !error && people?.length !== 0 && (
        <div className="block">
          <div className="box table-container">
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {peopleWithParents?.map(person => (
                  <tr
                    data-cy="person"
                    className={classNames('', {
                      'has-background-warning': selectedPerson === person.slug,
                    })}
                    key={person.name}
                  >
                    <td>
                      <NavLink
                        to={`/people/${person.slug}`}
                        className={classNames('', {
                          'has-text-danger': person.sex === 'f',
                        })}
                      >
                        {person.name}
                      </NavLink>
                    </td>

                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>{getRelativeLink(person, 'motherName')}</td>

                    <td>{getRelativeLink(person, 'fatherName')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* <Loader />

            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>

            <p data-cy="noPeopleMessage">
            There are no people on the server</p> */}

      <Outlet />
    </>
  );
};
